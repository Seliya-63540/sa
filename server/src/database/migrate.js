import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getDatabase, closeDatabase } from './connection.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, './migrations');

/**
 * Compute SHA256 checksum of migration file content
 */
function computeChecksum(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Ensure schema_migrations table exists
 */
async function ensureMigrationsTable(db) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      migration_name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);
}

/**
 * Retrieve list of all applied migrations from database
 */
async function getAppliedMigrations(db) {
  await ensureMigrationsTable(db);
  const rows = await db.all('SELECT version, migration_name, checksum, applied_at FROM schema_migrations ORDER BY version ASC;');
  const map = new Map();
  for (const row of rows) {
    map.set(row.version, row);
  }
  return map;
}

/**
 * Discover migration files on disk
 */
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .map((file) => {
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      const version = match ? match[1] : file.split('.')[0];
      return {
        file,
        version,
        fullPath: path.join(MIGRATIONS_DIR, file)
      };
    });
}

/**
 * Get detailed status of all migrations
 */
export async function getMigrationStatus({ db: customDb = null } = {}) {
  const db = customDb || (await getDatabase());
  const appliedMap = await getAppliedMigrations(db);
  const diskFiles = getMigrationFiles();

  const statuses = [];
  for (const item of diskFiles) {
    const content = fs.readFileSync(item.fullPath, 'utf8');
    const checksum = computeChecksum(content);
    const applied = appliedMap.get(item.version);

    let status = 'PENDING';
    let appliedAt = '-';

    if (applied) {
      if (applied.checksum !== checksum) {
        status = 'MODIFIED_CHECKSUM_MISMATCH';
      } else {
        status = 'APPLIED';
      }
      appliedAt = applied.applied_at;
    }

    statuses.push({
      version: item.version,
      migrationName: item.file,
      status,
      appliedAt,
      checksum: checksum.slice(0, 12)
    });
  }

  return statuses;
}

/**
 * Execute all pending database migrations in sequence
 */
export async function runMigrations({ db: customDb = null, silent = false } = {}) {
  const db = customDb || (await getDatabase());
  await ensureMigrationsTable(db);
  const appliedMap = await getAppliedMigrations(db);
  const diskFiles = getMigrationFiles();

  if (!silent) {
    logger.info(`Starting database migrations check on directory: ${MIGRATIONS_DIR}`);
  }

  let appliedCount = 0;

  for (const item of diskFiles) {
    const content = fs.readFileSync(item.fullPath, 'utf8');
    const checksum = computeChecksum(content);
    const applied = appliedMap.get(item.version);

    if (applied) {
      if (applied.checksum !== checksum) {
        const errorMsg = `Checksum mismatch on migration ${item.file}! Expected: ${applied.checksum}, Got: ${checksum}. Production migrations must not be modified.`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      continue;
    }

    // Apply pending migration atomically
    if (!silent) {
      logger.info(`Applying migration: ${item.file}...`);
    }

    try {
      await db.exec('BEGIN IMMEDIATE;');
      await db.exec(content);
      await db.run(
        'INSERT INTO schema_migrations (version, migration_name, checksum, applied_at) VALUES (?, ?, ?, strftime("%Y-%m-%dT%H:%M:%fZ", "now"));',
        [item.version, item.file, checksum]
      );
      await db.exec('COMMIT;');
      appliedCount++;
      if (!silent) {
        logger.info(`Successfully applied migration: ${item.file}`);
      }
    } catch (err) {
      await db.exec('ROLLBACK;').catch(() => {});
      logger.error(`Migration ${item.file} failed: ${err.message}`);
      throw err;
    }
  }

  if (!silent) {
    if (appliedCount === 0) {
      logger.info('Database schema is already up to date. No pending migrations.');
    } else {
      logger.info(`All migrations executed successfully. Total applied: ${appliedCount}`);
    }
  }

  return { appliedCount, total: diskFiles.length };
}

// CLI Execution handler
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const isStatusCheck = process.argv.includes('--status');

  (async () => {
    try {
      if (isStatusCheck) {
        console.log('\n--- SAFAR CYCLE DATABASE MIGRATION STATUS ---');
        const statuses = await getMigrationStatus();
        console.table(statuses);
      } else {
        await runMigrations();
      }
      await closeDatabase();
      process.exit(0);
    } catch (err) {
      console.error('\nMigration CLI Error:', err.message);
      await closeDatabase().catch(() => {});
      process.exit(1);
    }
  })();
}
