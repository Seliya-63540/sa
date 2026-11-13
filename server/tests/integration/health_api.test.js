import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../../src/app.js';
import { closeDatabase } from '../../src/database/connection.js';

describe('Express Health & Security API Integration Tests', () => {
  after(async () => {
    await closeDatabase();
  });

  test('GET /api/health returns 200 with standard envelope and database status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    const body = response.body;

    assert.equal(body.success, true);
    assert.equal(body.message, 'SAFAR CYCLE API is healthy');
    assert.ok(body.data);
    assert.equal(body.data.status, 'UP');
    assert.equal(body.data.database.connected, true);
    assert.equal(body.data.database.foreignKeys, true);
    assert.equal(body.data.database.journalMode, 'wal');

    // Security Headers check
    assert.equal(response.headers['x-frame-options'], 'DENY');
    assert.equal(response.headers['x-content-type-options'], 'nosniff');
    assert.ok(response.headers['x-request-id'], 'Must issue X-Request-Id header');
  });

  test('GET /api/nonexistent-route returns 404 with standard error envelope', async () => {
    const response = await request(app)
      .get('/api/nonexistent-route')
      .expect('Content-Type', /json/)
      .expect(404);

    const body = response.body;
    assert.equal(body.success, false);
    assert.equal(body.code, 'ROUTE_NOT_FOUND');
    assert.ok(body.message.includes('Cannot GET /api/nonexistent-route'));
  });
});
