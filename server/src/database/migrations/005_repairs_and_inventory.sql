-- Migration: 005_repairs_and_inventory.sql
-- Purpose: Workshop repair execution, spare parts catalog, repair part billing, and inventory movements

CREATE TABLE IF NOT EXISTS service_jobs (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL UNIQUE,
  diagnosis TEXT,
  work_required TEXT,
  work_performed TEXT,
  estimated_cost_paise INTEGER NOT NULL DEFAULT 0 CHECK (estimated_cost_paise >= 0),
  final_cost_paise INTEGER NOT NULL DEFAULT 0 CHECK (final_cost_paise >= 0),
  internal_notes TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (booking_id) REFERENCES service_bookings(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_service_jobs_booking_id ON service_jobs(booking_id);

CREATE TABLE IF NOT EXISTS spare_parts (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  part_name_en TEXT NOT NULL,
  part_name_gu TEXT,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  quantity_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
  reorder_level INTEGER NOT NULL DEFAULT 5 CHECK (reorder_level >= 0),
  purchase_cost_paise INTEGER NOT NULL DEFAULT 0 CHECK (purchase_cost_paise >= 0),
  selling_price_paise INTEGER NOT NULL DEFAULT 0 CHECK (selling_price_paise >= 0),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_spare_parts_sku ON spare_parts(sku);
CREATE INDEX IF NOT EXISTS idx_spare_parts_category ON spare_parts(category);
CREATE INDEX IF NOT EXISTS idx_spare_parts_stock ON spare_parts(quantity_on_hand);
CREATE INDEX IF NOT EXISTS idx_spare_parts_reorder ON spare_parts(reorder_level);

CREATE TABLE IF NOT EXISTS service_job_parts (
  id TEXT PRIMARY KEY,
  service_job_id TEXT NOT NULL,
  spare_part_id TEXT NOT NULL,
  part_name_snapshot TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_paise INTEGER NOT NULL CHECK (unit_price_paise >= 0),
  total_price_paise INTEGER NOT NULL CHECK (total_price_paise >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (service_job_id) REFERENCES service_jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_sjp_job_id ON service_job_parts(service_job_id);
CREATE INDEX IF NOT EXISTS idx_sjp_part_id ON service_job_parts(spare_part_id);

-- Append-only stock movements for both cycle inventory and spare-part workshop stock
CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  cycle_id TEXT,
  spare_part_id TEXT,
  movement_type TEXT NOT NULL CHECK (movement_type IN (
    'INITIAL_STOCK',
    'PURCHASE',
    'SALE',
    'REPAIR_USAGE',
    'RETURN',
    'ADJUSTMENT',
    'REVERSAL'
  )),
  quantity_change INTEGER NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  reason TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (
    (cycle_id IS NOT NULL AND spare_part_id IS NULL) OR
    (cycle_id IS NULL AND spare_part_id IS NOT NULL)
  ),
  FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE RESTRICT,
  FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_cycle ON stock_movements(cycle_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_part ON stock_movements(spare_part_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at);
