import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { authRepository } from '../modules/auth/auth.repository.js';
import { sessionRepository } from '../modules/sessions/session.repository.js';

/**
 * Middleware to require authenticated server-side session
 */
export async function authenticateUser(req, res, next) {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      throw new UnauthorizedError('Authentication required. Please log in.');
    }

    // Verify session has not been revoked in user_sessions
    if (req.session.id) {
      const activeMeta = await sessionRepository.findByInternalKey(req.session.id);
      if (activeMeta && activeMeta.revoked_at) {
        req.session.destroy(() => {});
        throw new UnauthorizedError('Your session has been terminated remotely. Please log in again.');
      }
    }

    // Verify user is active in SQLite
    const user = await authRepository.findById(req.session.user.id);
    if (!user || !user.is_active) {
      req.session.destroy(() => {});
      throw new ForbiddenError('Your account is currently disabled. Please contact shop administration.');
    }

    // Populate verified user on request
    req.user = {
      id: user.id,
      role: user.role,
      fullName: user.full_name,
      phone: user.phone,
      preferredLanguage: user.preferred_language
    };

    next();
  } catch (err) {
    next(err);
  }
}
