import { env } from '../config/env.js';

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLevel = env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

function formatLog(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}`;
}

export const logger = {
  error(message, meta) {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(formatLog('ERROR', message, meta));
    }
  },
  warn(message, meta) {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(formatLog('WARN', message, meta));
    }
  },
  info(message, meta) {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.log(formatLog('INFO', message, meta));
    }
  },
  debug(message, meta) {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.log(formatLog('DEBUG', message, meta));
    }
  }
};
