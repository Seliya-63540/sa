import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const requestId = req.headers['x-request-id'] || randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`, {
      requestId,
      ip: req.ip,
      statusCode: res.statusCode,
      durationMs: duration
    });
  });

  next();
}
