import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AsyncDatabase, resolveDbPath } from '../../src/database/connection.js';
import { runMigrations, getMigrationStatus } from '../../src/database/migrate.js';
import { withTransaction } from '../../src/database/transaction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_DB_PATH = path.resolve(__dirname, '../../database/test_integrity.sqlite');

describe('Database Foundation & Schema Integrity Tests', () => {
  let testDb;

  before(async () => {
    // Ensure clean state for test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    testDb = new AsyncDatabase(TEST_DB_PATH);
    await testDb.connect();
  });

  after(async () => {
    if (testDb) {
      await testDb.close();
    }
    // Clean up temporary test files
    for (const ext of ['', '-wal', '-shm']) {
      const file = `${TEST_DB_PATH}${ext}`;
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch {
          // ignore cleanup lock on Windows
        }
      }
    }
  });

  test('PRAGMA verification on connection', async () => {
    const fk = await testDb.get('PRAGMA foreign_keys;');
    assert.equal(fk.foreign_keys, 1, 'Foreign keys must be enabled (1)');

    const jm = await testDb.get('PRAGMA journal_mode;');
    assert.equal(jm.journal_mode, 'wal', 'Journal mode must be WAL');

    const bt = await testDb.get('PRAGMA busy_timeout;');
    assert.equal(bt.timeout, 5000, 'Busy timeout must be 5000ms');
  });

  test('Migration runner applies all 8 migration files', async () => {
    const result = await runMigrations({ db: testDb, silent: true });
    assert.equal(result.appliedCount, 8, 'All 8 migration files must be applied');

    // Run again and verify idempotency
    const rerun = await runMigrations({ db: testDb, silent: true });
    assert.equal(rerun.appliedCount, 0, 'Re-running migrations must apply 0 migrations');

    const statuses = await getMigrationStatus({ db: testDb });
    assert.equal(statuses.length, 8, '8 status records should exist');
    for (const item of statuses) {
      assert.equal(item.status, 'APPLIED', `Migration ${item.migrationName} must be APPLIED`);
    }
  });

  test('Verification that all 32 required tables exist', async () => {
    const rows = await testDb.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
    const tableNames = rows.map((r) => r.name);

    const expectedTables = [
      'app_settings',
      'audit_logs',
      'background_jobs',
      'booking_reschedule_history',
      'booking_status_history',
      'business_closures',
      'business_hours',
      'contact_messages',
      'customer_cycles',
      'cycle_enquiries',
      'cycle_images',
      'cycles',
      'document_sequences',
      'idempotency_keys',
      'invoices',
      'notification_outbox',
      'notifications',
      'password_reset_tokens',
      'payment_transactions',
      'sale_items',
      'sales',
      'schema_migrations',
      'service_bookings',
      'service_job_parts',
      'service_jobs',
      'service_types',
      'sessions',
      'spare_parts',
      'stock_movements',
      'user_sessions',
      'users',
      'web_push_subscriptions'
    ];

    assert.equal(tableNames.length, 32, `Must have exactly 32 tables. Found ${tableNames.length}`);
    for (const table of expectedTables) {
      assert.ok(tableNames.includes(table), `Table ${table} must exist in database`);
    }
  });

  test('Foreign key enforcement rejects orphan records', async () => {
    // Attempt inserting a customer_cycle for a non-existent user
    await assert.rejects(
      async () => {
        await testDb.run(`
          INSERT INTO customer_cycles (id, customer_id, nickname, brand, model)
          VALUES ('cc-invalid-01', 'non-existent-user-id', 'My Bike', 'Hero', 'Sprint');
        `);
      },
      (err) => {
        assert.ok(err.message.includes('FOREIGN KEY'), `Expected foreign key error, got: ${err.message}`);
        return true;
      }
    );
  });

  test('Unique constraints reject duplicate entries', async () => {
    // Create valid user
    await testDb.run(`
      INSERT INTO users (id, role, full_name, username, phone, password_hash, preferred_language)
      VALUES ('u-001', 'CUSTOMER', 'Arbaz Test', 'arbaztest', '9876543210', 'hashed_pass_argon2', 'gu');
    `);

    // Duplicate phone rejection
    await assert.rejects(
      async () => {
        await testDb.run(`
          INSERT INTO users (id, role, full_name, username, phone, password_hash, preferred_language)
          VALUES ('u-002', 'CUSTOMER', 'Duplicate Phone', 'dupuser', '9876543210', 'hash', 'en');
        `);
      },
      (err) => {
        assert.ok(err.message.includes('UNIQUE'), `Expected UNIQUE error on phone, got: ${err.message}`);
        return true;
      }
    );
  });

  test('CHECK constraints enforce data domains', async () => {
    // 1. Invalid User Role (Worker not allowed)
    await assert.rejects(
      async () => {
        await testDb.run(`
          INSERT INTO users (id, role, full_name, username, phone, password_hash)
          VALUES ('u-worker', 'WORKER', 'Worker Test', 'workertest', '9999999999', 'hash');
        `);
      },
      (err) => {
        assert.ok(err.message.includes('CHECK'), 'Invalid role must be rejected by CHECK constraint');
        return true;
      }
    );

    // 2. Negative Cycle Price
    await assert.rejects(
      async () => {
        await testDb.run(`
          INSERT INTO cycles (id, sku, name_en, brand, model, category, cycle_type, condition, price_paise, stock_quantity)
          VALUES ('cyc-neg', 'SKU-NEG', 'Neg Cycle', 'Brand', 'Model', 'MTB', 'Geared', 'NEW', -500, 2);
        `);
      },
      (err) => {
        assert.ok(err.message.includes('CHECK'), 'Negative price must be rejected');
        return true;
      }
    );

    // 3. Invalid Booking Status (e.g. CASUAL_DONE)
    await assert.rejects(
      async () => {
        await testDb.run(`
          INSERT INTO service_bookings (
            id, booking_number, customer_id, service_type_id,
            service_name_snapshot_en, cycle_name_snapshot, problem_description,
            status, requested_start_at, scheduled_start_at, scheduled_end_at,
            appointment_date, appointment_time_slot
          ) VALUES (
            'bk-invalid', 'BK-2026-9999', 'u-001', 'srv-none',
            'Service', 'Bike', 'Brakes broken',
            'CASUAL_DONE', '2026-11-10T10:00:00Z', '2026-11-10T10:00:00Z', '2026-11-10T11:00:00Z',
            '2026-11-10', '10:00 AM'
          );
        `);
      },
      (err) => {
        assert.ok(err.message.includes('CHECK'), 'Invalid status value must be rejected');
        return true;
      }
    );

    // 4. Invoice Mutual Exclusion CHECK Constraint
    await assert.rejects(
      async () => {
        // Invoice with BOTH sale_id AND service_job_id must be rejected
        await testDb.run(`
          INSERT INTO invoices (id, invoice_number, sale_id, service_job_id, subtotal_paise, total_paise)
          VALUES ('inv-both', 'INV-BOTH', 'sale-1', 'job-1', 10000, 10000);
        `);
      },
      (err) => {
        assert.ok(err.message.includes('CHECK'), 'Invoice referencing both sale and repair must be rejected');
        return true;
      }
    );
  });

  test('Transaction rollback functions reliably on error', async () => {
    const cycleId = 'cyc-tx-test';
    await testDb.run(`
      INSERT INTO cycles (id, sku, name_en, brand, model, category, cycle_type, condition, price_paise, stock_quantity)
      VALUES ('${cycleId}', 'SKU-TX-TEST', 'Tx Cycle', 'Brand', 'Model', 'MTB', 'Geared', 'NEW', 150000, 5);
    `);

    // Verify stock is 5
    const initialCycle = await testDb.get('SELECT stock_quantity FROM cycles WHERE id = ?;', [cycleId]);
    assert.equal(initialCycle.stock_quantity, 5);

    // Execute transaction that updates stock but intentionally fails at step 2
    await assert.rejects(
      async () => {
        await withTransaction(
          async (tx) => {
            // Step 1: deduct 2 units
            await tx.run('UPDATE cycles SET stock_quantity = stock_quantity - 2 WHERE id = ?;', [cycleId]);
            // Step 2: provoke constraint failure (duplicate primary key in cycles)
            await tx.run(`
              INSERT INTO cycles (id, sku, name_en, brand, model, category, cycle_type, condition, price_paise, stock_quantity)
              VALUES ('${cycleId}', 'DUPLICATE-KEY', 'Fail', 'B', 'M', 'C', 'T', 'NEW', 100, 1);
            `);
          },
          { db: testDb }
        );
      }
    );

    // Verify stock was rolled back to exactly 5
    const rolledBackCycle = await testDb.get('SELECT stock_quantity FROM cycles WHERE id = ?;', [cycleId]);
    assert.equal(rolledBackCycle.stock_quantity, 5, 'Stock change must be rolled back on transaction error');
  });

  test('Database persistence across connection restart', async () => {
    // Close connection
    await testDb.close();

    // Reopen connection against same file
    const reopenedDb = new AsyncDatabase(TEST_DB_PATH);
    await reopenedDb.connect();

    // Verify user created earlier is intact
    const user = await reopenedDb.get('SELECT full_name, role FROM users WHERE id = "u-001";');
    assert.ok(user, 'User must persist across connection restart');
    assert.equal(user.full_name, 'Arbaz Test');
    assert.equal(user.role, 'CUSTOMER');

    await reopenedDb.close();
  });
});
