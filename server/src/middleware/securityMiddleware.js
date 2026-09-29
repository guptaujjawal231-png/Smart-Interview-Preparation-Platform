import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * 200 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * Strict Auth Rate Limiter
 * 15 registration/login attempts per 15 minutes to prevent brute-force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

/**
 * AI Evaluation Rate Limiter
 * 20 AI evaluations per 15 minutes to protect API quota
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI evaluation quota limit reached for this session. Please wait a few minutes.',
  },
});

/**
 * NoSQL Injection Sanitizer
 * Recursively deletes any object keys containing '$' or '.' in-place to prevent MongoDB operator injection
 */
const sanitizeInPlace = (obj) => {
  if (!obj || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      sanitizeInPlace(obj[i]);
    }
    return;
  }

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      sanitizeInPlace(obj[key]);
    }
  }
};

export const sanitizeNoSql = (req, res, next) => {
  if (req.body) sanitizeInPlace(req.body);
  if (req.query) sanitizeInPlace(req.query);
  if (req.params) sanitizeInPlace(req.params);
  next();
};
