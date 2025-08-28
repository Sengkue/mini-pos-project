const express = require('express');

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const customerRoutes = require('./customers');
const transactionRoutes = require('./transactions');
const reportRoutes = require('./reports');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TXIV FEEJ POS API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'TXIV FEEJ POS API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        base: '/api/auth',
        description: 'Authentication and user management',
        endpoints: [
          'POST /login - User login',
          'POST /register - User registration',
          'POST /refresh-token - Refresh JWT token',
          'GET /profile - Get user profile',
          'PUT /profile - Update user profile',
          'POST /change-password - Change password',
          'POST /logout - User logout',
          'GET /verify - Verify token'
        ]
      },
      users: {
        base: '/api/users',
        description: 'User management (Admin/Manager only)',
        endpoints: [
          'GET / - Get all users',
          'GET /stats - Get user statistics',
          'GET /:id - Get user by ID',
          'POST / - Create new user',
          'PUT /:id - Update user',
          'DELETE /:id - Delete user',
          'POST /:id/reset-password - Reset user password'
        ]
      },
      categories: {
        base: '/api/categories',
        description: 'Product category management',
        endpoints: [
          'GET / - Get all categories',
          'GET /active - Get active categories',
          'GET /stats - Get category statistics',
          'GET /:id - Get category by ID',
          'POST / - Create new category',
          'PUT /:id - Update category',
          'DELETE /:id - Delete category',
          'POST /reorder - Reorder categories'
        ]
      },
      products: {
        base: '/api/products',
        description: 'Product management and inventory',
        endpoints: [
          'GET / - Get all products',
          'GET /active - Get active products',
          'GET /search - Search products',
          'GET /low-stock - Get low stock products',
          'GET /stats - Get product statistics',
          'GET /barcode/:barcode - Get product by barcode',
          'GET /:id - Get product by ID',
          'POST / - Create new product',
          'PUT /:id - Update product',
          'PUT /:id/stock - Update product stock',
          'DELETE /:id - Delete product'
        ]
      },
      customers: {
        base: '/api/customers',
        description: 'Customer management and loyalty system',
        endpoints: [
          'GET / - Get all customers',
          'GET /active - Get active customers',
          'GET /search - Search customers',
          'GET /top - Get top customers',
          'GET /stats - Get customer statistics',
          'GET /:id - Get customer by ID',
          'POST / - Create new customer',
          'PUT /:id - Update customer',
          'DELETE /:id - Delete customer',
          'POST /:id/loyalty-points/add - Add loyalty points',
          'POST /:id/loyalty-points/redeem - Redeem loyalty points'
        ]
      },
      transactions: {
        base: '/api/transactions',
        description: 'Sales transaction processing',
        endpoints: [
          'GET / - Get all transactions',
          'GET /stats - Get transaction statistics',
          'GET /daily-sales - Get daily sales report',
          'GET /number/:transactionNumber - Get transaction by number',
          'GET /:id - Get transaction by ID',
          'POST / - Create new transaction',
          'PUT /:id/status - Update transaction status',
          'POST /:id/refund - Process refund',
          'POST /:id/receipt-printed - Mark receipt as printed'
        ]
      },
      reports: {
        base: '/api/reports',
        description: 'Analytics and reporting',
        endpoints: [
          'GET /dashboard - Dashboard statistics',
          'GET /sales - Sales report',
          'GET /products - Product sales report',
          'GET /categories - Category sales report',
          'GET /inventory - Inventory report',
          'GET /customers - Customer report',
          'GET /cashiers - Sales by cashier report'
        ]
      }
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: '/api/docs'
  });
});

module.exports = router;