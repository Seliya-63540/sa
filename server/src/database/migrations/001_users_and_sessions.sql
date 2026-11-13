-- Migration: 001_users_and_sessions.sql
-- Purpose: Authentication, user accounts, sessions, and password recovery

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('CUSTOMER', 'ADMIN')),
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  phone TEXT UNIQUE,
  email TEXT,
  password_hash TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'gu' CHECK (preferred_language IN ('en', 'gu')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  phone_verified_at TEXT,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  archived_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Standard SQLite session store table (compatible with connect-sqlite3 and Express Session)
CREATE TABLE IF NOT EXISTS sessions (
  sid TEXT PRIMARY KEY,
  expired INTEGER NOT NULL,
  sess TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_expired ON sessions(expired);

-- Tracked active user sessions for admin monitoring and explicit revocation
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  internal_session_key TEXT NOT NULL,
  device_description TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_seen_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_public_id ON user_sessions(public_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pwd_reset_token ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_pwd_reset_user ON password_reset_tokens(user_id);
