/**
 * Standard REST API response helpers complying with Section 32 of Master Spec
 */

export function successResponse(res, { data = {}, message = 'Operation completed successfully', statusCode = 200 } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function paginatedResponse(res, { data = [], page = 1, limit = 12, total = 0, message = 'Data retrieved successfully', statusCode = 200 } = {}) {
  const totalPages = Math.ceil(total / (limit || 1)) || 0;
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
      totalPages
    }
  });
}

export function errorResponse(res, { message = 'An error occurred', code = 'INTERNAL_ERROR', fieldErrors = null, statusCode = 500 } = {}) {
  const payload = {
    success: false,
    message,
    code
  };

  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    payload.fieldErrors = fieldErrors;
  }

  return res.status(statusCode).json(payload);
}
