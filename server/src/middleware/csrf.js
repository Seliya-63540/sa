import crypto from 'crypto';
import { ForbiddenError } from '../utils/errors.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Validates session-bound CSRF token on all mutating HTTP requests
 */
export function validateCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const clientToken = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!clientToken || !sessionToken) {
    return next(new ForbiddenError('CSRF token missing or session expired. Please refresh the page.', 'CSRF_TOKEN_MISSING'));
  }

  const clientBuffer = Buffer.from(clientToken);
  const sessionBuffer = Buffer.from(sessionToken);

  if (clientBuffer.length !== sessionBuffer.length) {
    return next(new ForbiddenError('Invalid CSRF token mismatch', 'CSRF_TOKEN_INVALID'));
  }

  const isValid = crypto.timingSafeEqual(clientBuffer, sessionBuffer);
  if (!isValid) {
    return next(new ForbiddenError('Invalid CSRF token mismatch', 'CSRF_TOKEN_INVALID'));
  }

  next();
}
