const { validationResult } = require('express-validator');
const logger = require('../config/logger');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed:', {
      url: req.url,
      method: req.method,
      errors: errors.array(),
      body: req.body,
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Request sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Remove undefined and null values from query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (req.query[key] === 'undefined' || req.query[key] === 'null') {
        delete req.query[key];
      }
    });
  }

  // Trim string values in body
  if (req.body && typeof req.body === 'object') {
    const trimObject = (obj) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          trimObject(obj[key]);
        }
      });
    };
    trimObject(req.body);
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user ? req.user.username : 'anonymous'
    };

    if (res.statusCode >= 400) {
      logger.warn('Request completed with error:', logData);
    } else {
      logger.info('Request completed:', logData);
    }
  });

  next();
};

// Rate limiting for sensitive operations
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 5, message = 'Too many attempts') => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user.id : '');
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    attempts.forEach((time, attemptKey) => {
      if (time < windowStart) {
        attempts.delete(attemptKey);
      }
    });

    // Count attempts in current window
    const recentAttempts = Array.from(attempts.entries())
      .filter(([attemptKey, time]) => attemptKey.startsWith(key) && time >= windowStart)
      .length;

    if (recentAttempts >= max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((windowStart + windowMs - now) / 1000)
      });
    }

    attempts.set(`${key}-${now}`, now);
    next();
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  
  // Add cache control for API responses
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  sanitizeRequest,
  requestLogger,
  createRateLimiter,
  securityHeaders
};