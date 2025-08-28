const cors = require('cors');
const logger = require('../config/logger');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://localhost:3000'
    ];

    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development') {
      const localhostRegex = /^https?:\/\/localhost(:\d+)?$/;
      const localIPRegex = /^https?:\/\/127\.0\.0\.1(:\d+)?$/;
      
      if (localhostRegex.test(origin) || localIPRegex.test(origin)) {
        return callback(null, true);
      }
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-API-Key'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page'
  ],
  optionsSuccessStatus: 200 // Legacy browser support
};

// Custom CORS middleware with logging
const corsMiddleware = cors(corsOptions);

const corsWithLogging = (req, res, next) => {
  // Log CORS preflight requests
  if (req.method === 'OPTIONS') {
    logger.debug('CORS preflight request:', {
      origin: req.headers.origin,
      method: req.headers['access-control-request-method'],
      headers: req.headers['access-control-request-headers']
    });
  }

  corsMiddleware(req, res, (err) => {
    if (err) {
      logger.error('CORS error:', {
        error: err.message,
        origin: req.headers.origin,
        method: req.method,
        url: req.url
      });
      
      return res.status(403).json({
        success: false,
        message: 'CORS policy violation',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    next();
  });
};

// API key validation middleware (optional for additional security)
const validateApiKey = (req, res, next) => {
  // Skip API key validation in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  // If API key is configured, validate it
  if (validApiKey && apiKey !== validApiKey) {
    logger.warn('Invalid API key attempt:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      providedKey: apiKey ? 'provided' : 'missing'
    });

    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key'
    });
  }

  next();
};

module.exports = {
  corsWithLogging,
  validateApiKey,
  corsOptions
};