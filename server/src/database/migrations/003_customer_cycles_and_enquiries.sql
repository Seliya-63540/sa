-- Migration: 003_customer_cycles_and_enquiries.sql
-- Purpose: Customer-owned cycle garage and cycle purchase enquiries

CREATE TABLE IF NOT EXISTS customer_cycles (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT,
  cycle_type TEXT,
  colour TEXT,
  wheel_size TEXT,
  frame_number TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  archived_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_customer_cycles_cust_id ON customer_cycles(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_cycles_archived ON customer_cycles(archived_at);

CREATE TABLE IF NOT EXISTS cycle_enquiries (
  id TEXT PRIMARY KEY,
  enquiry_number TEXT NOT NULL UNIQUE,
  customer_id TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  cycle_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CONVERTED', 'CLOSED', 'CANCELLED')),
  admin_note TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_cycle_enquiries_num ON cycle_enquiries(enquiry_number);
CREATE INDEX IF NOT EXISTS idx_cycle_enquiries_customer ON cycle_enquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_cycle_enquiries_cycle ON cycle_enquiries(cycle_id);
CREATE INDEX IF NOT EXISTS idx_cycle_enquiries_status ON cycle_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_cycle_enquiries_created ON cycle_enquiries(created_at);
