-- Migration: 008_settings_jobs_and_system_tables.sql
-- Purpose: Dynamic business settings, operating calendar, persistent job queue, idempotency, and contact form

CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value_json TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0 CHECK (is_public IN (0, 1)),
  updated_by TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_app_settings_public ON app_settings(is_public);

CREATE TABLE IF NOT EXISTS business_hours (
  id TEXT PRIMARY KEY,
  weekday INTEGER NOT NULL UNIQUE CHECK (weekday BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday ... 6=Saturday
  is_open INTEGER NOT NULL DEFAULT 1 CHECK (is_open IN (0, 1)),
  opening_time TEXT NOT NULL,
  closing_time TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS business_closures (
  id TEXT PRIMARY KEY,
  closure_date TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  is_closed INTEGER NOT NULL DEFAULT 1 CHECK (is_closed IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_closures_date ON business_closures(closure_date);

-- Persistent background job runner table surviving process restarts
CREATE TABLE IF NOT EXISTS background_jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'RETRY', 'FAILED')),
  run_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts INTEGER NOT NULL DEFAULT 5,
  locked_at TEXT,
  locked_by TEXT,
  last_error TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_bg_jobs_status_run ON background_jobs(status, run_at);
CREATE INDEX IF NOT EXISTS idx_bg_jobs_type ON background_jobs(job_type);

-- HTTP operation idempotency to prevent duplicate double-clicks
CREATE TABLE IF NOT EXISTS idempotency_keys (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_json TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL,
  UNIQUE(scope, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_idempotency_lookup ON idempotency_keys(scope, idempotency_key);
CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_keys(expires_at);

-- Inquiries sent through public contact form
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'READ', 'RESPONDED', 'ARCHIVED')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at);

-- Migration ledger table
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  migration_name TEXT NOT NULL,
  checksum TEXT NOT NULL,
  applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
