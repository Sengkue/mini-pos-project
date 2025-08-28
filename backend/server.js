require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Import configurations and middleware
const logger = require('./config/logger');
const db = require('./models');
const { corsWithLogging } = require('./middleware/cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { 
  requestLogger, 
  sanitizeRequest, 
  securityHeaders 
} = require('./middleware/validation');

// Import routes
const apiRoutes = require('./routes');

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Trust proxy if behind a reverse proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// CORS
app.use(corsWithLogging);

// Security headers
app.use(securityHeaders);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request sanitization
app.use(sanitizeRequest);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (before API routes)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TXIV FEEJ POS Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TXIV FEEJ POS API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Socket client connected: ${socket.id}`);

  // Join room for real-time updates
  socket.on('join-pos', (userId) => {
    socket.join('pos-room');
    logger.info(`User ${userId} joined POS room`);
  });

  // Handle inventory updates
  socket.on('inventory-update', (data) => {
    socket.to('pos-room').emit('inventory-updated', data);
  });

  // Handle new transactions
  socket.on('transaction-created', (data) => {
    socket.to('pos-room').emit('new-transaction', data);
  });

  // Handle low stock alerts
  socket.on('low-stock-alert', (data) => {
    socket.to('pos-room').emit('low-stock', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket client disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const PORT = process.env.PORT || 8081;

const startServer = async () => {
  try {
    // Test database connection
    await db.testConnection();
    
    // Sync database (be careful in production)
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      logger.info('Database synchronized successfully');
    }

    // Start server
    server.listen(PORT, () => {
      logger.info(`
╔══════════════════════════════════════╗
║        TXIV FEEJ POS SERVER          ║
║                                      ║
║  Environment: ${process.env.NODE_ENV?.padEnd(23) || 'development'.padEnd(23)} ║
║  Port: ${PORT.toString().padEnd(29)} ║
║  Database: ${(process.env.DB_NAME || 'txivfeej-shop').padEnd(25)} ║
║                                      ║
║  API Documentation: /api/docs        ║
║  Health Check: /health               ║
║                                      ║
╚══════════════════════════════════════╝
      `);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await db.sequelize.close();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await db.sequelize.close();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = { app, server, io };