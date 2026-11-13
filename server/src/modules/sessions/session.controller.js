import { sessionService } from './session.service.js';
import { successResponse } from '../../utils/response.js';

export const sessionController = {
  async getActiveSessions(req, res, next) {
    try {
      const sessions = await sessionService.getActiveSessions();
      return successResponse(res, {
        message: 'Active sessions retrieved',
        data: sessions
      });
    } catch (err) {
      next(err);
    }
  },

  async revokeSession(req, res, next) {
    try {
      const { publicId } = req.params;
      const result = await sessionService.revokeSession(publicId, req.user?.id, req.ip);
      return successResponse(res, {
        message: result.message,
        data: null
      });
    } catch (err) {
      next(err);
    }
  }
};
