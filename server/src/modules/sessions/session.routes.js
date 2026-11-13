import { Router } from 'express';
import { sessionController } from './session.controller.js';
import { authenticateUser } from '../../middleware/authenticate.js';
import { requireAdmin } from '../../middleware/authorize.js';
import { validateCsrf } from '../../middleware/csrf.js';

const router = Router();

// Admin-only session management routes
router.get('/active-sessions', authenticateUser, requireAdmin, sessionController.getActiveSessions);
router.delete('/sessions/:publicId', authenticateUser, requireAdmin, validateCsrf, sessionController.revokeSession);
// Support POST as well if frontend sends POST /admin/sessions/:id/revoke
router.post('/sessions/:publicId/revoke', authenticateUser, requireAdmin, validateCsrf, sessionController.revokeSession);

export default router;
