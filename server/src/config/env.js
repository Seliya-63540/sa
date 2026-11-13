import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_ORIGINS: z.string().default('http://localhost:5173,http://localhost:3000'),
  DATABASE_PATH: z.string().default('./database/safar_cycle.sqlite'),
  SESSION_SECRET: z.string().min(16).default('safar_cycle_default_secret_key_needs_override_32bytes'),
  SESSION_MAX_AGE_MS: z.coerce.number().default(7 * 24 * 60 * 60 * 1000),
  BUSINESS_NAME: z.string().default('SAFAR CYCLE'),
  BUSINESS_NAME_GUJARATI: z.string().default('સફર સાઇકલ'),
  BUSINESS_TIMEZONE: z.string().default('Asia/Kolkata'),
  BUSINESS_CURRENCY: z.string().default('INR'),
  UPLOAD_DIRECTORY: z.string().default('./storage/uploads'),
  BACKUP_DIRECTORY: z.string().default('./storage/backups'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(300),
  INITIAL_ADMIN_NAME: z.string().default('SAFAR Workshop Owner'),
  INITIAL_ADMIN_USERNAME: z.string().default('admin'),
  INITIAL_ADMIN_PHONE: z.string().default('9876543210'),
  INITIAL_ADMIN_PASSWORD: z.string().default('admin123')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('CRITICAL: Invalid environment configuration:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const isDevelopment = env.NODE_ENV === 'development';
