import session from 'express-session';
import { env, isProduction } from './env.js';
import { getDatabase } from '../database/connection.js';
import { logger } from '../utils/logger.js';

/**
 * High-performance, connection-safe SQLite Session Store for Express
 * Compatible with the 'sessions' table defined in migration 001.
 */
export class SQLiteSessionStore extends session.Store {
  constructor({ table = 'sessions' } = {}) {
    super();
    this.table = table;

    // Daily background cleanup of expired sessions
    this.cleanupTimer = setInterval(async () => {
      try {
        const db = await getDatabase();
        await db.run(`DELETE FROM ${this.table} WHERE expired < ?;`, [Date.now()]);
      } catch (err) {
        logger.error(`Session cleanup error: ${err.message}`);
      }
    }, 24 * 60 * 60 * 1000);

    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  async get(sid, callback) {
    try {
      const db = await getDatabase();
      const row = await db.get(
        `SELECT sess FROM ${this.table} WHERE sid = ? AND expired >= ?;`,
        [sid, Date.now()]
      );

      if (!row) {
        return callback(null, null);
      }

      const sess = JSON.parse(row.sess);
      callback(null, sess);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid, sess, callback) {
    try {
      const db = await getDatabase();
      const maxAge = sess.cookie?.maxAge || env.SESSION_MAX_AGE_MS;
      const expired = Date.now() + maxAge;
      const json = JSON.stringify(sess);

      await db.run(
        `INSERT INTO ${this.table} (sid, expired, sess) VALUES (?, ?, ?)
         ON CONFLICT(sid) DO UPDATE SET expired = excluded.expired, sess = excluded.sess;`,
        [sid, expired, json]
      );

      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  async destroy(sid, callback) {
    try {
      const db = await getDatabase();
      await db.run(`DELETE FROM ${this.table} WHERE sid = ?;`, [sid]);
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  async touch(sid, sess, callback) {
    try {
      const db = await getDatabase();
      const maxAge = sess.cookie?.maxAge || env.SESSION_MAX_AGE_MS;
      const expired = Date.now() + maxAge;

      await db.run(
        `UPDATE ${this.table} SET expired = ? WHERE sid = ?;`,
        [expired, sid]
      );

      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  close() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

let storeInstance = null;

export function getSessionStore() {
  if (!storeInstance) {
    storeInstance = new SQLiteSessionStore();
  }
  return storeInstance;
}

export function createSessionMiddleware() {
  return session({
    store: getSessionStore(),
    name: 'safar_sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : 'lax',
      maxAge: env.SESSION_MAX_AGE_MS,
      path: '/'
    }
  });
}
