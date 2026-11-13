# SAFAR CYCLE — Backend Setup & Operations Guide

## 1. Prerequisites
- **Node.js**: Active LTS (v20+ or v24+)
- **NPM**: v10+ or v12+
- **SQLite3**

## 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cd server
copy .env.example .env
```
Ensure `DATABASE_PATH` points to `./database/safar_cycle.sqlite` or your preferred local path.

## 3. Database Migration
To check migration status:
```bash
npm run db:status
```
To run all pending migrations:
```bash
npm run db:migrate
```

## 4. Running the Server
Development with auto-reload:
```bash
npm run dev
```
Production start:
```bash
npm start
```

## 5. Health Check
Verify server and database health:
```bash
curl http://localhost:5000/api/health
```
Response:
```json
{
  "success": true,
  "message": "SAFAR CYCLE API is healthy",
  "data": {
    "status": "UP",
    "timestamp": "2026-11-09T15:22:00.000Z",
    "environment": "development",
    "database": {
      "connected": true,
      "foreignKeys": true,
      "journalMode": "wal"
    }
  }
}
```

## 6. Running Tests
Run automated integration and database tests:
```bash
npm test
```
