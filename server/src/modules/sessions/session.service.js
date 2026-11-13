import { sessionRepository } from './session.repository.js';
import { NotFoundError } from '../../utils/errors.js';
import { authRepository } from '../auth/auth.repository.js';
import { AUTH_EVENTS } from '../auth/auth.constants.js';

export const sessionService = {
  async getActiveSessions() {
    const rawSessions = await sessionRepository.findActiveSessions();
    return rawSessions.map((s) => ({
      id: s.public_id,
      accountName: s.account_name,
      role: s.role,
      device: s.device_description || 'Web Browser',
      ip: s.ip_address || 'Localhost',
      lastActivity: s.last_seen_at,
      status: 'Active',
      createdAt: s.created_at
    }));
  },

  async revokeSession(publicId, adminUserId = null, ipAddress = null) {
    const existing = await sessionRepository.findByPublicId(publicId);
    if (!existing) {
      throw new NotFoundError('Session record not found');
    }

    await sessionRepository.revokeByPublicId(publicId);

    await authRepository.recordAuditLog({
      actorId: adminUserId,
      action: AUTH_EVENTS.SESSION_REVOKED,
      entityType: 'SESSION',
      entityId: publicId,
      beforeData: { userId: existing.user_id, device: existing.device_description },
      ipAddress
    });

    return { message: 'Session revoked successfully' };
  }
};
