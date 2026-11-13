import cors from 'cors';
import { env } from './env.js';

const allowedOrigins = env.CLIENT_ORIGINS.split(',').map((o) => o.trim());

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 86400 // 24 hours
};

export const corsMiddleware = cors(corsOptions);
