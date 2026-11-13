import crypto from 'crypto';
import { authService } from './auth.service.js';
import { registerSchema, loginSchema, changePasswordSchema } from './auth.validation.js';
import { successResponse } from '../../utils/response.js';
import { ValidationError } from '../../utils/errors.js';

export const authController = {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError('Registration validation failed', validation.error.flatten().fieldErrors);
      }

      const user = await authService.registerCustomer({
        ...validation.data,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      // Establish session immediately upon registration for seamless customer onboarding
      if (req.session) {
        req.session.user = {
          id: user.id,
          role: user.role
        };
      }

      return successResponse(res, {
        statusCode: 201,
        message: 'Customer registered successfully',
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError('Login validation failed', validation.error.flatten().fieldErrors);
      }

      const user = await authService.login({
        identifier: validation.data.identifier,
        password: validation.data.password,
        portal: validation.data.portal,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        req
      });

      return successResponse(res, {
        message: 'Logged in successfully',
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      await authService.logout(req.session, req.ip);
      res.clearCookie('safar_sid');
      return successResponse(res, {
        message: 'Logged out successfully',
        data: null
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/auth/me
   */
  async me(req, res, next) {
    try {
      const userId = req.session?.user?.id;
      const user = await authService.getCurrentUser(userId);
      return successResponse(res, {
        message: 'Current profile retrieved',
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/auth/csrf
   * Issues or retrieves session-bound CSRF token
   */
  async csrf(req, res, next) {
    try {
      if (!req.session) {
        return res.status(500).json({ success: false, message: 'Session store uninitialized' });
      }

      if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
      }

      return successResponse(res, {
        message: 'CSRF token retrieved',
        data: {
          csrfToken: req.session.csrfToken
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const validation = changePasswordSchema.safeParse(req.body);
      if (!validation.success) {
        throw new ValidationError('Password change validation failed', validation.error.flatten().fieldErrors);
      }

      const userId = req.session?.user?.id;
      const result = await authService.changePassword({
        userId,
        currentPassword: validation.data.currentPassword,
        newPassword: validation.data.newPassword,
        currentSessionKey: req.session?.id,
        ipAddress: req.ip
      });

      return successResponse(res, {
        message: result.message,
        data: null
      });
    } catch (err) {
      next(err);
    }
  }
};
