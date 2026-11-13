import { getDatabase } from '../../database/connection.js';

export const authRepository = {
  async findById(id) {
    const db = await getDatabase();
    return db.get(
      'SELECT id, role, full_name, username, phone, email, password_hash, preferred_language, is_active, last_login_at, created_at FROM users WHERE id = ?;',
      [id]
    );
  },

  async findByPhone(normalizedPhone) {
    const db = await getDatabase();
    // Also match stripped 10-digit if phone was stored without +91 in legacy/seeds
    const digits10 = normalizedPhone.replace(/\D/g, '').slice(-10);
    return db.get(
      'SELECT id, role, full_name, username, phone, email, password_hash, preferred_language, is_active, last_login_at FROM users WHERE phone = ? OR phone = ?;',
      [normalizedPhone, digits10]
    );
  },

  async findByUsername(username) {
    const db = await getDatabase();
    return db.get(
      'SELECT id, role, full_name, username, phone, email, password_hash, preferred_language, is_active, last_login_at FROM users WHERE LOWER(username) = LOWER(?);',
      [username]
    );
  },

  async findByIdentifier(identifier) {
    const db = await getDatabase();
    const cleanDigits = identifier.replace(/\D/g, '');
    let normalizedPhone = null;
    if (cleanDigits.length >= 10) {
      normalizedPhone = `+91${cleanDigits.slice(-10)}`;
    }

    return db.get(
      `SELECT id, role, full_name, username, phone, email, password_hash, preferred_language, is_active, last_login_at 
       FROM users 
       WHERE LOWER(username) = LOWER(?) 
          OR phone = ? 
          OR (phone IS NOT NULL AND phone = ?);`,
      [identifier, identifier, normalizedPhone || '']
    );
  },

  async createCustomer({ id, fullName, phone, passwordHash, preferredLanguage }) {
    const db = await getDatabase();
    await db.run(
      `INSERT INTO users (
        id, role, full_name, phone, password_hash, preferred_language, is_active, created_at, updated_at
      ) VALUES (?, 'CUSTOMER', ?, ?, ?, ?, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`,
      [id, fullName, phone, passwordHash, preferredLanguage || 'gu']
    );

    return this.findById(id);
  },

  async createAdmin({ id, fullName, username, phone, passwordHash, preferredLanguage = 'en' }) {
    const db = await getDatabase();
    await db.run(
      `INSERT INTO users (
        id, role, full_name, username, phone, password_hash, preferred_language, is_active, created_at, updated_at
      ) VALUES (?, 'ADMIN', ?, ?, ?, ?, ?, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`,
      [id, fullName, username, phone || null, passwordHash, preferredLanguage]
    );

    return this.findById(id);
  },

  async updateLastLogin(id) {
    const db = await getDatabase();
    return db.run(
      `UPDATE users SET last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?;`,
      [id]
    );
  },

  async updatePassword(id, passwordHash) {
    const db = await getDatabase();
    return db.run(
      `UPDATE users SET password_hash = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?;`,
      [passwordHash, id]
    );
  },

  async recordAuditLog({ actorId = null, action, entityType = 'USER', entityId, beforeData = null, afterData = null, ipAddress = null }) {
    try {
      const db = await getDatabase();
      const crypto = await import('crypto');
      const logId = `log-${crypto.randomUUID()}`;

      await db.run(
        `INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, before_data, after_data, ip_address, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`,
        [
          logId,
          actorId,
          action,
          entityType,
          entityId,
          beforeData ? JSON.stringify(beforeData) : null,
          afterData ? JSON.stringify(afterData) : null,
          ipAddress
        ]
      );
    } catch (err) {
      // Don't crash main thread if audit logging fails
      console.error('Audit log write error:', err.message);
    }
  }
};
