import { getDatabase } from '../../database/connection.js';

export const sessionRepository = {
  async createUserSession({ id, publicId, userId, internalSessionKey, deviceDescription, userAgent, ipAddress, expiresAt }) {
    const db = await getDatabase();
    return db.run(
      `INSERT INTO user_sessions (
        id, public_id, user_id, internal_session_key, device_description, user_agent, ip_address, expires_at, created_at, last_seen_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));`,
      [id, publicId, userId, internalSessionKey, deviceDescription, userAgent, ipAddress, expiresAt]
    );
  },

  async findActiveSessions() {
    const db = await getDatabase();
    return db.all(
      `SELECT s.id, s.public_id, s.user_id, s.device_description, s.user_agent, s.ip_address, 
              s.created_at, s.last_seen_at, s.expires_at,
              u.full_name AS account_name, u.role, u.phone, u.username
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.revoked_at IS NULL
         AND s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       ORDER BY s.last_seen_at DESC;`
    );
  },

  async findByPublicId(publicId) {
    const db = await getDatabase();
    return db.get(
      `SELECT * FROM user_sessions WHERE public_id = ?;`,
      [publicId]
    );
  },

  async findByInternalKey(internalKey) {
    const db = await getDatabase();
    return db.get(
      `SELECT * FROM user_sessions WHERE internal_session_key = ? AND revoked_at IS NULL;`,
      [internalKey]
    );
  },

  async revokeByPublicId(publicId) {
    const db = await getDatabase();
    return db.run(
      `UPDATE user_sessions 
       SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') 
       WHERE public_id = ? AND revoked_at IS NULL;`,
      [publicId]
    );
  },

  async revokeAllUserSessions(userId, exceptInternalKey = null) {
    const db = await getDatabase();
    if (exceptInternalKey) {
      return db.run(
        `UPDATE user_sessions 
         SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') 
         WHERE user_id = ? AND internal_session_key != ? AND revoked_at IS NULL;`,
        [userId, exceptInternalKey]
      );
    }
    return db.run(
      `UPDATE user_sessions 
       SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') 
       WHERE user_id = ? AND revoked_at IS NULL;`,
      [userId]
    );
  },

  async touchLastSeen(internalKey) {
    const db = await getDatabase();
    return db.run(
      `UPDATE user_sessions 
       SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') 
       WHERE internal_session_key = ?;`,
      [internalKey]
    );
  }
};
