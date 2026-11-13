-- Migration: 006_sales_invoices_and_payments.sql
-- Purpose: Physical in-person shop sales, multi-item line bills, unified invoices, and payments ledger

CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id TEXT,
  walk_in_customer_name TEXT,
  walk_in_customer_phone TEXT,
  subtotal_paise INTEGER NOT NULL CHECK (subtotal_paise >= 0),
  discount_paise INTEGER NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  grand_total_paise INTEGER NOT NULL CHECK (grand_total_paise >= 0),
  sale_status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (sale_status IN ('COMPLETED', 'VOIDED')),
  recorded_by TEXT NOT NULL,
  sold_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_sales_invoice_num ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON sales(sold_at);

CREATE TABLE IF NOT EXISTS sale_items (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  product_name_snapshot TEXT NOT NULL,
  brand_snapshot TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_paise INTEGER NOT NULL CHECK (unit_price_paise >= 0),
  discount_paise INTEGER NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  line_total_paise INTEGER NOT NULL CHECK (line_total_paise >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT,
  FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_cycle ON sale_items(cycle_id);

-- Unified billing entity referencing strictly ONE of either a cycle sale or a workshop repair job
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  sale_id TEXT UNIQUE,
  service_job_id TEXT UNIQUE,
  customer_id TEXT,
  subtotal_paise INTEGER NOT NULL CHECK (subtotal_paise >= 0),
  discount_paise INTEGER NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  total_paise INTEGER NOT NULL CHECK (total_paise >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (
    (sale_id IS NOT NULL AND service_job_id IS NULL) OR
    (sale_id IS NULL AND service_job_id IS NOT NULL)
  ),
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE RESTRICT,
  FOREIGN KEY (service_job_id) REFERENCES service_jobs(id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_sale ON invoices(sale_id);
CREATE INDEX IF NOT EXISTS idx_invoices_repair ON invoices(service_job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);

-- Append-only physical shop payments ledger (Cash, Shop UPI, Other)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'COLLECTION' CHECK (transaction_type IN ('COLLECTION', 'REFUND')),
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'UPI', 'OTHER')),
  payment_reference TEXT,
  recorded_by TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payment_transactions(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_received_at ON payment_transactions(received_at);
