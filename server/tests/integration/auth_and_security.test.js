import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../../src/app.js';
import { getDatabase, closeDatabase } from '../../src/database/connection.js';
import { runMigrations } from '../../src/database/migrate.js';
import { bootstrapAdmin } from '../../src/database/seeds/createAdmin.js';
import { ownership } from '../../src/utils/ownership.js';
import { NotFoundError } from '../../src/utils/errors.js';

describe('Phase 3: Authentication, Session Management & Security Integration Tests', () => {
  before(async () => {
    // Run migrations on active test database
    await runMigrations({ silent: true });
    // Seed initial admin
    await bootstrapAdmin({ silent: true });
  });

  after(async () => {
    await closeDatabase();
  });

  describe('CSRF Synchronizer Token Protection', () => {
    test('GET /api/auth/csrf generates and returns a session-bound CSRF token', async () => {
      const agent = request.agent(app);
      const res = await agent.get('/api/auth/csrf').expect(200);

      assert.equal(res.body.success, true);
      const token = res.body.data.csrfToken;
      assert.ok(token, 'Must issue a csrfToken');
      assert.equal(typeof token, 'string');
      assert.equal(token.length, 64, 'Token must be 64-character hex (32 bytes)');
    });

    test('POST request without CSRF token is rejected with 403 CSRF_TOKEN_MISSING', async () => {
      const agent = request.agent(app);
      const res = await agent
        .post('/api/auth/register')
        .send({
          fullName: 'No Csrf User',
          phone: '9825100001',
          password: 'password123'
        })
        .expect(403);

      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'CSRF_TOKEN_MISSING');
    });

    test('POST request with invalid CSRF token is rejected with 403 CSRF_TOKEN_INVALID', async () => {
      const agent = request.agent(app);
      await agent.get('/api/auth/csrf'); // establish session

      const res = await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', 'invalid-token-tampered-hex-value-abcdef1234567890abcdef1234567890')
        .send({
          fullName: 'Tampered Csrf User',
          phone: '9825100002',
          password: 'password123'
        })
        .expect(403);

      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'CSRF_TOKEN_INVALID');
    });
  });

  describe('Customer Registration', () => {
    test('Successful registration creates CUSTOMER role and returns safe user profile', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;
      const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      const res = await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'Arbaz Seliya Test',
          phone,
          password: 'securePassword123',
          preferredLanguage: 'gu',
          role: 'ADMIN' // Malicious attempt to inject ADMIN role
        })
        .expect(201);

      assert.equal(res.body.success, true);
      const user = res.body.data.user;
      assert.equal(user.fullName, 'Arbaz Seliya Test');
      assert.equal(user.phone, `+91${phone}`);
      assert.equal(user.role, 'CUSTOMER', 'Role must strictly remain CUSTOMER regardless of input');
      assert.equal(user.preferredLanguage, 'gu');
      assert.equal(user.passwordHash, undefined, 'Password hash must NEVER be returned');
      assert.equal(user.password, undefined);
    });

    test('Duplicate phone registration is rejected with 409 Conflict', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;
      const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      // First registration
      await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'User One',
          phone,
          password: 'password123'
        })
        .expect(201);

      // Duplicate registration
      const dupRes = await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'User Two',
          phone, // Same phone
          password: 'otherPassword123'
        })
        .expect(409);

      assert.equal(dupRes.body.success, false);
      assert.equal(dupRes.body.code, 'CONFLICT');
    });

    test('Invalid phone number format is rejected with 422', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;

      const res = await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'Bad Phone User',
          phone: '12345',
          password: 'password123'
        })
        .expect(422);

      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'VALIDATION_ERROR');
    });
  });

  describe('Authentication & Session Management', () => {
    test('Unauthenticated GET /api/auth/me returns 401 UNAUTHENTICATED', async () => {
      const guest = request(app);
      const res = await guest.get('/api/auth/me').expect(401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'UNAUTHENTICATED');
    });

    test('Valid customer login establishes session and GET /api/auth/me succeeds', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;
      const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      // Register
      await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'Customer Login Test',
          phone,
          password: 'myPassword123'
        })
        .expect(201);

      // Login
      const loginRes = await agent
        .post('/api/auth/login')
        .set('X-CSRF-Token', token)
        .send({
          identifier: phone,
          password: 'myPassword123',
          portal: 'CUSTOMER'
        })
        .expect(200);

      assert.equal(loginRes.body.success, true);
      assert.equal(loginRes.body.data.user.role, 'CUSTOMER');

      // Check /api/auth/me
      const meRes = await agent.get('/api/auth/me').expect(200);
      assert.equal(meRes.body.success, true);
      assert.equal(meRes.body.data.user.fullName, 'Customer Login Test');
      assert.equal(meRes.body.data.user.role, 'CUSTOMER');
    });

    test('Customer attempting to log in with portal=ADMIN is rejected with 403 FORBIDDEN_ROLE', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;
      const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      // Register as customer
      await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'Not Admin',
          phone,
          password: 'password123'
        })
        .expect(201);

      // Attempt login with portal=ADMIN
      const res = await agent
        .post('/api/auth/login')
        .set('X-CSRF-Token', token)
        .send({
          identifier: phone,
          password: 'password123',
          portal: 'ADMIN'
        })
        .expect(403);

      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'FORBIDDEN_ROLE');
    });

    test('Invalid password fails with generic 401 INVALID_CREDENTIALS', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;

      const res = await agent
        .post('/api/auth/login')
        .set('X-CSRF-Token', token)
        .send({
          identifier: 'admin',
          password: 'wrongPasswordXYZ'
        })
        .expect(401);

      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'INVALID_CREDENTIALS');
    });

    test('Admin login succeeds with admin username and admin portal', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;

      const res = await agent
        .post('/api/auth/login')
        .set('X-CSRF-Token', token)
        .send({
          identifier: 'admin',
          password: 'admin123',
          portal: 'ADMIN'
        })
        .expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data.user.role, 'ADMIN');
      assert.equal(res.body.data.user.username, 'admin');

      // Admin can access admin-only endpoint
      const sessRes = await agent.get('/api/admin/active-sessions').expect(200);
      assert.equal(sessRes.body.success, true);
      assert.ok(Array.isArray(sessRes.body.data));
    });

    test('Customer cannot access Admin-only active sessions endpoint (403 FORBIDDEN)', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;
      const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      // Register and login as customer
      await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'Customer Only',
          phone,
          password: 'password123'
        })
        .expect(201);

      // Customer accesses admin endpoint -> 403 Forbidden
      const res = await agent.get('/api/admin/active-sessions').expect(403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.code, 'FORBIDDEN');
    });
  });

  describe('Customer Data Isolation & Ownership Validation', () => {
    test('Customer A cannot access Customer B record via ownership validator', async () => {
      const db = await getDatabase();
      const userBId = `usr-b-${Date.now()}`;
      const cycleBId = `cc-b-${Date.now()}`;
      const phoneB = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      // Insert user B
      await db.run(`
        INSERT INTO users (id, role, full_name, phone, password_hash, preferred_language)
        VALUES ('${userBId}', 'CUSTOMER', 'Customer B', '${phoneB}', 'hash_test', 'en');
      `);

      // Insert cycle for user B
      await db.run(`
        INSERT INTO customer_cycles (id, customer_id, nickname, brand, model)
        VALUES ('${cycleBId}', '${userBId}', 'Customer B Cycle', 'Atlas', 'Gold');
      `);

      // Customer A tries to access Customer B cycle
      const customerAId = `usr-a-${Date.now()}`;
      await assert.rejects(
        async () => {
          await ownership.verifyCustomerCycle(cycleBId, customerAId);
        },
        (err) => {
          assert.ok(err instanceof NotFoundError);
          assert.equal(err.statusCode, 404);
          return true;
        }
      );
    });
  });

  describe('Session Termination & Logout', () => {
    test('POST /api/auth/logout destroys session and clears cookies', async () => {
      const agent = request.agent(app);
      const csrfRes = await agent.get('/api/auth/csrf');
      const token = csrfRes.body.data.csrfToken;
      const phone = '98' + Math.floor(10000000 + Math.random() * 90000000).toString();

      // Register customer
      await agent
        .post('/api/auth/register')
        .set('X-CSRF-Token', token)
        .send({
          fullName: 'Logout Test User',
          phone,
          password: 'password123'
        })
        .expect(201);

      // Verify authenticated
      await agent.get('/api/auth/me').expect(200);

      // Logout
      const res = await agent
        .post('/api/auth/logout')
        .set('X-CSRF-Token', token)
        .expect(200);

      assert.equal(res.body.success, true);

      // Now GET /api/auth/me must return 401
      const meRes = await agent.get('/api/auth/me').expect(401);
      assert.equal(meRes.body.success, false);
    });
  });
});
