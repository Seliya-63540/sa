import rateLimit from 'express-rate-limit';

function createLimiter({ windowMs, max, message, code = 'RATE_LIMIT_EXCEEDED' }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        code
      });
    }
  });
}

// Strict limiter on authentication endpoints (5 attempts per 15 minutes)
export const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  code: 'AUTH_RATE_LIMIT_EXCEEDED'
});

// Registration limiter (5 per hour)
export const registerRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many registration attempts. Please try again later.',
  code: 'REGISTER_RATE_LIMIT_EXCEEDED'
});

// Contact form limiter (10 per hour)
export const contactRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: 'Too many inquiries submitted from this IP address. Please try again later.',
  code: 'CONTACT_RATE_LIMIT_EXCEEDED'
});
