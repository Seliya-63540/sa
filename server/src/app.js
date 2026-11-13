import express from 'express';
import { corsMiddleware } from './config/cors.js';
import { helmetMiddleware, globalRateLimiter } from './config/security.js';
import { createSessionMiddleware } from './config/session.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { successResponse, errorResponse } from './utils/response.js';
import { getDatabase } from './database/connection.js';
import { env } from './config/env.js';

import authRoutes from './modules/auth/auth.routes.js';
import sessionRoutes from './modules/sessions/session.routes.js';

const app = express();

// 1. Security Headers
app.use(helmetMiddleware);

// 2. CORS Handling
app.use(corsMiddleware);

// 3. Request Correlation & Structured Logging
app.use(requestLogger);

// 4. Server-Side Persistent SQLite Sessions
app.use(createSessionMiddleware());

// 5. Global API Rate Limiter
app.use('/api', globalRateLimiter);

// 6. Body Parsing with Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Health Check
app.get('/api/health', async (req, res, next) => {
  try {
    const db = await getDatabase();
    const dbCheck = await db.get('SELECT 1 AS healthy, datetime("now") AS server_utc');
    const fkCheck = await db.get('PRAGMA foreign_keys;');
    const journalCheck = await db.get('PRAGMA journal_mode;');

    return successResponse(res, {
      message: 'SAFAR CYCLE API is healthy',
      data: {
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        database: {
          connected: Boolean(dbCheck?.healthy === 1),
          foreignKeys: Boolean(fkCheck?.foreign_keys === 1),
          journalMode: journalCheck?.journal_mode || 'unknown'
        }
      }
    });
  } catch (err) {
    return next(err);
  }
});

// 8. Mount Module Routers
app.use('/api/auth', authRoutes);
app.use('/api/admin', sessionRoutes);

// 9. Unmatched Route Handler (404)
app.use((req, res) => {
  return errorResponse(res, {
    message: `Cannot ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
    statusCode: 404
  });
});

// 10. Centralized Error Handler
app.use(errorHandler);

export default app;
