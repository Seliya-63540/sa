-- Migration: 004_services_and_bookings.sql
-- Purpose: Workshop service catalogue, appointments, status state machine, and document numbering

CREATE TABLE IF NOT EXISTS service_types (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_gu TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'maintenance',
  description_en TEXT,
  description_gu TEXT,
  estimated_duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (estimated_duration_minutes > 0),
  pricing_type TEXT NOT NULL DEFAULT 'STARTING_FROM' CHECK (pricing_type IN ('FIXED', 'STARTING_FROM', 'AFTER_INSPECTION')),
  indicative_price_paise INTEGER NOT NULL DEFAULT 0 CHECK (indicative_price_paise >= 0),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  is_popular INTEGER NOT NULL DEFAULT 0 CHECK (is_popular IN (0, 1)),
  icon TEXT DEFAULT 'wrench',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_service_types_active ON service_types(is_active);
CREATE INDEX IF NOT EXISTS idx_service_types_order ON service_types(display_order);

CREATE TABLE IF NOT EXISTS service_bookings (
  id TEXT PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  customer_cycle_id TEXT,
  service_type_id TEXT NOT NULL,
  service_name_snapshot_en TEXT NOT NULL,
  service_name_snapshot_gu TEXT,
  cycle_name_snapshot TEXT NOT NULL,
  cycle_brand_snapshot TEXT,
  problem_description TEXT NOT NULL,
  customer_notes TEXT,
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN (
    'REQUESTED',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
    'NO_SHOW'
  )),
  requested_start_at TEXT NOT NULL,
  scheduled_start_at TEXT NOT NULL,
  scheduled_end_at TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time_slot TEXT NOT NULL,
  estimated_cost_paise INTEGER NOT NULL DEFAULT 0 CHECK (estimated_cost_paise >= 0),
  rejection_reason TEXT,
  cancellation_reason TEXT,
  confirmed_at TEXT,
  checked_in_at TEXT,
  started_at TEXT,
  completed_at TEXT,
  cancelled_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_cycle_id) REFERENCES customer_cycles(id) ON DELETE RESTRICT,
  FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_bookings_number ON service_bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON service_bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_start ON service_bookings(scheduled_start_at);

-- Append-only status transition history
CREATE TABLE IF NOT EXISTS booking_status_history (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL CHECK (new_status IN (
    'REQUESTED',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
    'NO_SHOW'
  )),
  changed_by_user_id TEXT,
  change_source TEXT NOT NULL CHECK (change_source IN ('CUSTOMER', 'ADMIN', 'SYSTEM')),
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (booking_id) REFERENCES service_bookings(id) ON DELETE RESTRICT,
  FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_bsh_booking_id ON booking_status_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_bsh_created_at ON booking_status_history(created_at);

-- Reschedule audit history
CREATE TABLE IF NOT EXISTS booking_reschedule_history (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  old_start_at TEXT NOT NULL,
  old_end_at TEXT NOT NULL,
  new_start_at TEXT NOT NULL,
  new_end_at TEXT NOT NULL,
  changed_by_user_id TEXT,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (booking_id) REFERENCES service_bookings(id) ON DELETE RESTRICT,
  FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_brh_booking_id ON booking_reschedule_history(booking_id);

-- Sequence counter for atomic sequential human-readable identifiers
CREATE TABLE IF NOT EXISTS document_sequences (
  id TEXT PRIMARY KEY,
  sequence_name TEXT NOT NULL,
  sequence_year INTEGER NOT NULL,
  last_number INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(sequence_name, sequence_year)
);
