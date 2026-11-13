-- Migration: 002_cycles_and_images.sql
-- Purpose: Public cycle catalogue for sale, product specifications, and optimized images

CREATE TABLE IF NOT EXISTS cycles (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_gu TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL,
  cycle_type TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('NEW', 'USED')),
  description_en TEXT,
  description_gu TEXT,
  price_paise INTEGER NOT NULL CHECK (price_paise >= 0),
  original_price_paise INTEGER CHECK (original_price_paise >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  wheel_size TEXT,
  frame_size TEXT,
  gear_information TEXT,
  colour TEXT,
  listing_status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (listing_status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED')),
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  archived_at TEXT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cycles_sku ON cycles(sku);
CREATE INDEX IF NOT EXISTS idx_cycles_listing_status ON cycles(listing_status);
CREATE INDEX IF NOT EXISTS idx_cycles_category ON cycles(category);
CREATE INDEX IF NOT EXISTS idx_cycles_brand ON cycles(brand);
CREATE INDEX IF NOT EXISTS idx_cycles_price ON cycles(price_paise);
CREATE INDEX IF NOT EXISTS idx_cycles_condition ON cycles(condition);

CREATE TABLE IF NOT EXISTS cycle_images (
  id TEXT PRIMARY KEY,
  cycle_id TEXT NOT NULL,
  image_path TEXT NOT NULL,
  thumbnail_path TEXT,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cycle_images_cycle_id ON cycle_images(cycle_id);
CREATE INDEX IF NOT EXISTS idx_cycle_images_primary ON cycle_images(cycle_id, is_primary);
