import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { DatabaseError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the directory for the database file exists
export function resolveDbPath(customPath = null) {
  const rawPath = customPath || env.DATABASE_PATH;
  const resolved = path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(__dirname, '../../', rawPath);
  
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return resolved;
}

/**
 * Configure standard SQLite PRAGMAs for high reliability & concurrency
 */
export function configurePragmas(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) return reject(new DatabaseError('Failed to enable foreign_keys', err));
      });
      db.run('PRAGMA journal_mode = WAL;', (err) => {
        if (err) return reject(new DatabaseError('Failed to set journal_mode WAL', err));
      });
      db.run('PRAGMA busy_timeout = 5000;', (err) => {
        if (err) return reject(new DatabaseError('Failed to set busy_timeout', err));
      });
      db.run('PRAGMA synchronous = NORMAL;', (err) => {
        if (err) return reject(new DatabaseError('Failed to set synchronous NORMAL', err));
        resolve();
      });
    });
  });
}

/**
 * Promisified SQLite Database Wrapper
 */
export class AsyncDatabase {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.rawDb = null;
    this.isReady = false;
  }

  async connect() {
    if (this.rawDb && this.isReady) return this;

    return new Promise((resolve, reject) => {
      this.rawDb = new sqlite3.Database(this.dbPath, async (err) => {
        if (err) {
          logger.error(`Failed to open SQLite database at ${this.dbPath}: ${err.message}`);
          return reject(new DatabaseError(`Cannot connect to database at ${this.dbPath}`, err));
        }

        try {
          await configurePragmas(this.rawDb);
          this.isReady = true;
          logger.info(`SQLite connection established and configured (WAL mode, FK enabled): ${this.dbPath}`);
          resolve(this);
        } catch (pragmaErr) {
          reject(pragmaErr);
        }
      });
    });
  }

  /**
   * Run a query that doesn't return rows (INSERT, UPDATE, DELETE)
   * Resolves with { lastID, changes }
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.rawDb.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  /**
   * Fetch a single row (SELECT ... LIMIT 1)
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.rawDb.get(sql, params, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row || null);
      });
    });
  }

  /**
   * Fetch all rows (SELECT)
   */
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.rawDb.all(sql, params, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows || []);
      });
    });
  }

  /**
   * Execute raw multi-statement SQL script
   */
  exec(sql) {
    return new Promise((resolve, reject) => {
      this.rawDb.exec(sql, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Close the database connection safely
   */
  close() {
    return new Promise((resolve, reject) => {
      if (!this.rawDb) return resolve();
      this.rawDb.close((err) => {
        if (err) {
          logger.error(`Error closing database: ${err.message}`);
          return reject(err);
        }
        this.rawDb = null;
        this.isReady = false;
        resolve();
      });
    });
  }
}

// Global managed singleton database instance
let mainDbInstance = null;

export async function getDatabase(customPath = null) {
  if (customPath) {
    const customDb = new AsyncDatabase(resolveDbPath(customPath));
    await customDb.connect();
    return customDb;
  }

  if (!mainDbInstance) {
    mainDbInstance = new AsyncDatabase(resolveDbPath());
    await mainDbInstance.connect();
  }
  return mainDbInstance;
}

export async function closeDatabase() {
  if (mainDbInstance) {
    await mainDbInstance.close();
    mainDbInstance = null;
  }
}
