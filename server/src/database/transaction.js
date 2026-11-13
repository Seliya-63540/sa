import { getDatabase } from './connection.js';
import { logger } from '../utils/logger.js';
import { DatabaseError } from '../utils/errors.js';

/**
 * Mutex queue to serialize critical multi-step write transactions on SQLite
 * avoiding "cannot start a transaction within a transaction" errors.
 */
let transactionQueue = Promise.resolve();

function acquireTransactionLock() {
  let release;
  const promise = new Promise((resolve) => {
    release = resolve;
  });
  const current = transactionQueue;
  transactionQueue = current.then(() => promise);
  return current.then(() => release);
}

/**
 * Execute a sequence of database operations within a safe SQLite transaction.
 *
 * @param {Function} callback - async (tx) => Promise<T>
 * @param {Object} options - { mode: 'DEFERRED' | 'IMMEDIATE' | 'EXCLUSIVE', db: AsyncDatabase }
 * @returns {Promise<T>}
 */
export async function withTransaction(callback, { mode = 'IMMEDIATE', db: customDb = null } = {}) {
  const releaseLock = await acquireTransactionLock();
  const db = customDb || (await getDatabase());

  try {
    const beginSql = `BEGIN ${mode.toUpperCase()} TRANSACTION;`;
    await db.exec(beginSql);

    const txContext = {
      run: (sql, params) => db.run(sql, params),
      get: (sql, params) => db.get(sql, params),
      all: (sql, params) => db.all(sql, params),
      exec: (sql) => db.exec(sql)
    };

    const result = await callback(txContext);
    await db.exec('COMMIT;');
    return result;
  } catch (error) {
    try {
      await db.exec('ROLLBACK;');
    } catch (rollbackError) {
      logger.error(`Failed to rollback transaction: ${rollbackError.message}`);
    }
    logger.warn(`Transaction rolled back due to error: ${error.message}`);
    throw error instanceof DatabaseError ? error : new DatabaseError('Transaction failed', error);
  } finally {
    releaseLock();
  }
}
