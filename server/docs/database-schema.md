# SAFAR CYCLE — Database Schema Reference

This reference documents all 32 relational tables created across the 8 migrations.

---

### Migration 001: Users & Sessions
- **`users`**: Customer and Admin accounts.
  - `id` (TEXT, PK): Unique identifier.
  - `role` (TEXT, CHECK: 'CUSTOMER', 'ADMIN'): User authorization role.
  - `full_name` (TEXT): Customer or staff name.
  - `username` (TEXT, UNIQUE): Admin username.
  - `phone` (TEXT, UNIQUE): 10-digit mobile number.
  - `password_hash` (TEXT): Argon2id password hash.
  - `preferred_language` (TEXT, CHECK: 'en', 'gu').
  - `is_active` (INTEGER, DEFAULT 1).
  - `created_at`, `updated_at`, `archived_at` (TEXT UTC).
- **`sessions`**: Express session store backing table (`sid`, `expired`, `sess`).
- **`user_sessions`**: Tracked active sessions for admin visibility and remote revocation.
- **`password_reset_tokens`**: Hashed single-use recovery tokens (`token_hash`, `expires_at`, `used_at`).

---

### Migration 002: Cycles & Images
- **`cycles`**: Catalogue bicycles for sale.
  - `id` (TEXT, PK), `sku` (TEXT, UNIQUE), `name_en` (TEXT), `name_gu` (TEXT), `brand` (TEXT), `model` (TEXT).
  - `category` (TEXT), `cycle_type` (TEXT), `condition` (TEXT, CHECK: 'NEW', 'USED').
  - `price_paise` (INTEGER >= 0), `stock_quantity` (INTEGER >= 0).
  - `listing_status` (TEXT, CHECK: 'DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED').
- **`cycle_images`**: Product photos (`image_path`, `thumbnail_path`, `is_primary`, `display_order`).

---

### Migration 003: Customer Cycles & Enquiries
- **`customer_cycles`**: Bicycles personally owned by customers for workshop maintenance (`customer_id`, `nickname`, `brand`, `model`, `frame_number`).
- **`cycle_enquiries`**: Inquiries submitted regarding sales cycles (`enquiry_number`, `customer_id`, `cycle_id`, `message`, `status` CHECK: 'NEW', 'CONTACTED', 'CONVERTED', 'CLOSED', 'CANCELLED').

---

### Migration 004: Service Catalogue & Bookings
- **`service_types`**: Workshop service offerings (`name_en`, `name_gu`, `estimated_duration_minutes`, `pricing_type` CHECK: 'FIXED', 'STARTING_FROM', 'AFTER_INSPECTION', `indicative_price_paise`).
- **`service_bookings`**: Service appointments.
  - `booking_number` (TEXT, UNIQUE, e.g. `BK-2026-0001`).
  - `customer_id` (TEXT, FK users), `customer_cycle_id` (TEXT, FK customer_cycles).
  - `status` (TEXT, CHECK: 'REQUESTED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'NO_SHOW').
  - `appointment_date`, `appointment_time_slot`, `requested_start_at`, `scheduled_start_at`, `scheduled_end_at`.
- **`booking_status_history`**: Append-only status transitions (`booking_id`, `old_status`, `new_status`, `changed_by_user_id`, `change_source` CHECK: 'CUSTOMER', 'ADMIN', 'SYSTEM', `note`).
- **`booking_reschedule_history`**: Audit trail of appointment reschedules.
- **`document_sequences`**: Thread-safe atomic sequential numbering (`sequence_name`, `sequence_year`, `last_number`).

---

### Migration 005: Repairs & Inventory
- **`service_jobs`**: Workshop repair operations (`booking_id` UNIQUE 1:1, `diagnosis`, `work_performed`, `estimated_cost_paise`, `final_cost_paise`, `internal_notes`).
- **`spare_parts`**: Workshop inventory items (`sku` UNIQUE, `part_name_en`, `part_name_gu`, `quantity_on_hand` >= 0, `reorder_level` >= 0, `purchase_cost_paise`, `selling_price_paise`).
- **`service_job_parts`**: Spare parts consumed in a repair job (`service_job_id`, `spare_part_id`, `quantity`, `unit_price_paise`, `total_price_paise`).
- **`stock_movements`**: Immutable log of inventory adjustments for cycles and spare parts (`movement_type` CHECK: 'INITIAL_STOCK', 'PURCHASE', 'SALE', 'REPAIR_USAGE', 'RETURN', 'ADJUSTMENT', 'REVERSAL').

---

### Migration 006: Sales, Invoices & Payments
- **`sales`**: In-person cycle sales records (`invoice_number` UNIQUE, `customer_id`, `subtotal_paise`, `discount_paise`, `grand_total_paise`, `sale_status` CHECK: 'COMPLETED', 'VOIDED').
- **`sale_items`**: Line items within a sale (`sale_id`, `cycle_id`, `sku_snapshot`, `quantity`, `unit_price_paise`, `line_total_paise`).
- **`invoices`**: Unified billing entity with mutual exclusion CHECK constraint linking either `sale_id` or `service_job_id`.
- **`payment_transactions`**: Physical payment ledger (`invoice_id`, `transaction_type` CHECK: 'COLLECTION', 'REFUND', `amount_paise` > 0, `payment_method` CHECK: 'CASH', 'UPI', 'OTHER', `payment_reference`, `recorded_by`).

---

### Migration 007: Notifications & Audit Logs
- **`notifications`**: Customer and admin in-app notification center (`recipient_user_id`, `title_en`, `title_gu`, `message_en`, `message_gu`, `is_read`).
- **`notification_outbox`**: External notification delivery queue for WhatsApp and Web Push with exponential backoff.
- **`web_push_subscriptions`**: Browser push notification keys.
- **`audit_logs`**: Security and operations audit trail (`actor_user_id`, `action`, `entity_type`, `entity_id`, `before_data`, `after_data`, `ip_address`).

---

### Migration 008: Settings, Jobs & System Tables
- **`app_settings`**: Key-value JSON store for workshop settings.
- **`business_hours`**: Weekly operating hours (weekday 0-6, `is_open`, `opening_time`, `closing_time`).
- **`business_closures`**: Holidays and temporary closures.
- **`background_jobs`**: Persistent background worker task queue (`job_type`, `payload_json`, `status` CHECK: 'PENDING', 'PROCESSING', 'COMPLETED', 'RETRY', 'FAILED').
- **`idempotency_keys`**: Request deduplication store (`scope`, `idempotency_key`, `request_hash`, `response_json`, `expires_at`).
- **`contact_messages`**: Public contact form submissions.
- **`schema_migrations`**: Database migration tracking ledger.
