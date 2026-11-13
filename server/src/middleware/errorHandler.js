import { AppError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  logger.error(`Error occurred processing ${req.method} ${req.originalUrl}: ${err.message}`, {
    requestId: req.id,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code || 'UNKNOWN_ERROR'
  });

  if (err instanceof AppError) {
    return errorResponse(res, {
      message: err.message,
      code: err.code,
      fieldErrors: err.fieldErrors,
      statusCode: err.statusCode
    });
  }

  // Handle SyntaxError for malformed JSON bodies
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, {
      message: 'Malformed JSON payload in request body',
      code: 'INVALID_JSON',
      statusCode: 400
    });
  }

  // Handle SQLite specific constraint errors gracefully
  if (err.message && err.message.includes('SQLITE_CONSTRAINT')) {
    let code = 'DATABASE_CONSTRAINT_ERROR';
    let message = 'A database integrity constraint was violated';

    if (err.message.includes('UNIQUE')) {
      code = 'DUPLICATE_ENTRY';
      message = 'A record with this identifier already exists';
    } else if (err.message.includes('FOREIGN KEY')) {
      code = 'FOREIGN_KEY_VIOLATION';
      message = 'Referenced related record does not exist';
    }

    return errorResponse(res, {
      message,
      code,
      statusCode: 409
    });
  }

  // Generic internal server error
  const message = env.NODE_ENV === 'production'
    ? 'An unexpected internal error occurred'
    : err.message || 'Internal Server Error';

  return errorResponse(res, {
    message,
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500
  });
}
