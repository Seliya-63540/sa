import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';
import { AUTH_ROLES } from '../modules/auth/auth.constants.js';

/**
 * Higher-order middleware to restrict endpoints to specific role(s)
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required before authorization'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied: Requires role ${allowedRoles.join(' or ')}`));
    }

    next();
  };
}

export const requireAdmin = requireRole([AUTH_ROLES.ADMIN]);
export const requireCustomer = requireRole([AUTH_ROLES.CUSTOMER, AUTH_ROLES.ADMIN]);
export const requireStrictCustomer = requireRole([AUTH_ROLES.CUSTOMER]);
