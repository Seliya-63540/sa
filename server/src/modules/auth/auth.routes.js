import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticateUser } from '../../middleware/authenticate.js';
import { validateCsrf } from '../../middleware/csrf.js';
import { authRateLimiter, registerRateLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// CSRF token generation
router.get('/csrf', authController.csrf);

// Public Auth Endpoints with Rate Limiting & CSRF Validation
router.post('/register', registerRateLimiter, validateCsrf, authController.register);
router.post('/login', authRateLimiter, validateCsrf, authController.login);

// Protected Auth Endpoints
router.get('/me', authenticateUser, authController.me);
router.post('/logout', authenticateUser, validateCsrf, authController.logout);
router.post('/change-password', authenticateUser, validateCsrf, authController.changePassword);

export default router;
