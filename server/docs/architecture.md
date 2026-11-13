# SAFAR CYCLE — Backend Architecture Documentation

## 1. System Architecture
SAFAR CYCLE backend is a **Modular Monolith** built on **Node.js (Active LTS)**, **Express.js**, and **SQLite3**. It exposes a clean REST API matching the existing React/Vite/Tailwind frontend.

```
+---------------------------------------------------------------------------------+
|                                React.js Frontend                                |
|  - React Router DOM   - TanStack Query / Hooks   - i18next (en / gu)            |
+---------------------------------------------------------------------------------+
                                         |
                                   HTTP / Cookies
                                         |
+---------------------------------------------------------------------------------+
| Express.js Application Server (Modular Monolith)                                 |
|                                                                                 |
|  [Security Pipeline]                                                            |
|   Helmet -> CORS (credentials) -> Rate Limiting -> Request Logger               |
|                                                                                 |
|  [Module Boundaries]                                                            |
|   * auth, users, sessions                                                       |
|   * cycles, cycleImages, customerCycles                                         |
|   * enquiries                                                                   |
|   * serviceTypes, bookings, bookingHistory                                      |
|   * repairs, inventory                                                          |
|   * sales, invoices, payments                                                   |
|   * notifications, auditLogs, businessSettings                                  |
|                                                                                 |
|  [Data & Concurrency Layer]                                                     |
|   * AsyncDatabase Promisified Interface                                         |
|   * Serialized Transaction Control (withTransaction / BEGIN IMMEDIATE)          |
|   * PRAGMAs: foreign_keys=ON, journal_mode=WAL, busy_timeout=5000               |
+---------------------------------------------------------------------------------+
                                         |
                                  Filesystem Storage
                                         |
+---------------------------------------------------------------------------------+
| Storage Layer                                                                   |
|  - database/safar_cycle.sqlite (WAL Mode)                                       |
|  - storage/uploads/cycles/ (Processed photos)                                   |
|  - storage/backups/ (SQLite safe backups)                                       |
+---------------------------------------------------------------------------------+
```

## 2. Directory Structure & Layer Responsibilities
- `src/config/`: Centralized environment (`env.js`), security headers (`security.js`), CORS (`cors.js`).
- `src/database/`:
  - `connection.js`: Managed SQLite connection with enforced PRAGMAs.
  - `transaction.js`: Transaction helper preventing concurrency race conditions.
  - `migrate.js`: Atomic migration runner with SHA256 checksums and status inspector.
  - `migrations/`: Versioned SQL migration files (`001_...` through `008_...`).
- `src/middleware/`:
  - `errorHandler.js`: Centralized error normalization.
  - `requestLogger.js`: Request correlation with `X-Request-Id`.
- `src/utils/`: Standardized REST envelopes (`response.js`), custom error classes (`errors.js`), structured logger (`logger.js`).

## 3. Financial and Date Standards
1. **Currency in Integer Paise:** All financial values (`price_paise`, `estimated_cost_paise`, `final_cost_paise`, `subtotal_paise`, `amount_paise`) are stored as integers (e.g. `₹100 = 10000 paise`). Floating point rounding errors are completely eliminated.
2. **ISO-8601 UTC Timestamps:** All database timestamps use `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`.
3. **Business Timezone:** Appointments are scheduled in `Asia/Kolkata` time and stored with UTC reference.
