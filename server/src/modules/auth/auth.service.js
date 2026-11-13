import crypto from 'crypto';
import { authRepository } from './auth.repository.js';
import { sessionRepository } from '../sessions/session.repository.js';
import { passwordService } from './password.service.js';
import { normalizeIndianPhone } from './auth.validation.js';
import { AUTH_ROLES, AUTH_EVENTS } from './auth.constants.js';
import { 
  AppError, 
  ConflictError, 
  UnauthorizedError, 
  ForbiddenError, 
  NotFoundError 
} from '../../utils/errors.js';

function formatSafeUser(user) {
  return {
    id: user.id,
    role: user.role,
    fullName: user.full_name,
    username: user.username || undefined,
    phone: user.phone || undefined,
    email: user.email || undefined,
    preferredLanguage: user.preferred_language || 'gu',
    lastLoginAt: user.last_login_at || null,
    createdAt: user.created_at || null
  };
}

function parseDeviceDescription(userAgent = '') {
  if (!userAgent) return 'Web Browser / Unknown Device';
  if (/Android/i.test(userAgent)) return 'Chrome Android / Mobile Device';
  if (/iPhone|iPad/i.test(userAgent)) return 'Safari iOS / Apple Mobile';
  if (/Windows/i.test(userAgent)) return 'Desktop Browser / Windows';
  if (/Macintosh/i.test(userAgent)) return 'Desktop Browser / macOS';
  if (/Linux/i.test(userAgent)) return 'Desktop Browser / Linux';
  return 'Web Browser / Desktop';
}

export const authService = {
  /**
   * Register a new customer
   */
  async registerCustomer({ fullName, phone, password, preferredLanguage = 'gu', ipAddress = null, userAgent = null }) {
    const normalizedPhone = normalizeIndianPhone(phone);
    if (!normalizedPhone) {
      throw new AppError('Please enter a valid 10-digit Indian mobile number', 422, 'INVALID_PHONE');
    }

    const existingUser = await authRepository.findByPhone(normalizedPhone);
    if (existingUser) {
      throw new ConflictError('An account with this mobile number already exists');
    }

    const passwordHash = await passwordService.hash(password);
    const userId = `usr-${crypto.randomUUID()}`;

    const newUser = await authRepository.createCustomer({
      id: userId,
      fullName,
      phone: normalizedPhone,
      passwordHash,
      preferredLanguage: preferredLanguage || 'gu'
    });

    await authRepository.recordAuditLog({
      actorId: userId,
      action: AUTH_EVENTS.CUSTOMER_REGISTERED,
      entityType: 'USER',
      entityId: userId,
      afterData: { fullName, phone: normalizedPhone, role: AUTH_ROLES.CUSTOMER },
      ipAddress
    });

    return formatSafeUser(newUser);
  },

  /**
   * Authenticate customer or admin
   */
  async login({ identifier, password, portal = null, ipAddress = null, userAgent = null, req = null }) {
    const user = await authRepository.findByIdentifier(identifier);

    // Generic error to prevent account enumeration
    const invalidCredsError = new UnauthorizedError('Invalid mobile number/username or password', 'INVALID_CREDENTIALS');

    if (!user) {
      throw invalidCredsError;
    }

    if (!user.is_active) {
      throw new ForbiddenError('Your account has been deactivated. Please contact workshop support.', 'ACCOUNT_DEACTIVATED');
    }

    const passwordValid = await passwordService.verify(user.password_hash, password);
    if (!passwordValid) {
      await authRepository.recordAuditLog({
        actorId: user.id,
        action: AUTH_EVENTS.LOGIN_FAILED,
        entityType: 'USER',
        entityId: user.id,
        ipAddress
      });
      throw invalidCredsError;
    }

    // Portal check enforcement: the requested access path must match the user's role.
    // A CUSTOMER account cannot use the ADMIN portal, and vice versa.
    if (portal && portal !== user.role) {
      throw new ForbiddenError(`Access denied: This account is not allowed to access the ${portal} portal`, 'FORBIDDEN_ROLE');
    }

    // Update last login timestamp
    await authRepository.updateLastLogin(user.id);

    // Regenerate session if req provided
    if (req && req.session) {
      await new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) return reject(new AppError('Session generation error', 500));
          resolve();
        });
      });

      // Bind session state to the new session
      req.session.user = {
        id: user.id,
        role: user.role
      };

      // Ensure session is committed to store before response is returned
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      // Record in user_sessions tracking table
      const sessionPublicId = `sess-${crypto.randomUUID().slice(0, 12)}`;
      const expiresAt = new Date(Date.now() + (req.session.cookie?.maxAge || 7 * 24 * 60 * 60 * 1000)).toISOString();
      const deviceDescription = parseDeviceDescription(userAgent);

      await sessionRepository.createUserSession({
        id: `usess-${crypto.randomUUID()}`,
        publicId: sessionPublicId,
        userId: user.id,
        internalSessionKey: req.session.id,
        deviceDescription,
        userAgent,
        ipAddress,
        expiresAt
      });
    }

    await authRepository.recordAuditLog({
      actorId: user.id,
      action: user.role === AUTH_ROLES.ADMIN ? AUTH_EVENTS.ADMIN_LOGIN : AUTH_EVENTS.CUSTOMER_LOGIN,
      entityType: 'USER',
      entityId: user.id,
      ipAddress
    });

    return formatSafeUser(user);
  },

  /**
   * Get current authenticated user details
   */
  async getCurrentUser(userId) {
    if (!userId) {
      throw new UnauthorizedError('No active session found');
    }

    const user = await authRepository.findById(userId);
    if (!user || !user.is_active) {
      throw new UnauthorizedError('Session user no longer active');
    }

    return formatSafeUser(user);
  },

  /**
   * Change password for authenticated user
   */
  async changePassword({ userId, currentPassword, newPassword, currentSessionKey = null, ipAddress = null }) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const validCurrent = await passwordService.verify(user.password_hash, currentPassword);
    if (!validCurrent) {
      throw new UnauthorizedError('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
    }

    const newHash = await passwordService.hash(newPassword);
    await authRepository.updatePassword(userId, newHash);

    // Invalidate other sessions for security
    if (currentSessionKey) {
      await sessionRepository.revokeAllUserSessions(userId, currentSessionKey);
    }

    await authRepository.recordAuditLog({
      actorId: userId,
      action: AUTH_EVENTS.PASSWORD_CHANGED,
      entityType: 'USER',
      entityId: userId,
      ipAddress
    });

    return { message: 'Password updated successfully' };
  },

  /**
   * Terminate active session
   */
  async logout(session, ipAddress = null) {
    if (!session) return;

    const userId = session.user?.id;
    const sessionKey = session.id;

    if (sessionKey) {
      const activeSession = await sessionRepository.findByInternalKey(sessionKey);
      if (activeSession) {
        await sessionRepository.revokeByPublicId(activeSession.public_id);
      }
    }

    if (userId) {
      await authRepository.recordAuditLog({
        actorId: userId,
        action: AUTH_EVENTS.LOGOUT,
        entityType: 'USER',
        entityId: userId,
        ipAddress
      });
    }

    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) return reject(new AppError('Logout failure', 500));
        resolve();
      });
    });
  }
};
