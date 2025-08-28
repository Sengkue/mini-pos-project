const express = require('express');
const { query } = require('express-validator');
const reportsController = require('../controllers/reportsController');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const dateRangeValidation = [
  query('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
];

const salesReportValidation = [
  ...dateRangeValidation,
  query('groupBy')
    .optional()
    .isIn(['hour', 'day', 'week', 'month'])
    .withMessage('groupBy must be hour, day, week, or month')
];

const productSalesValidation = [
  ...dateRangeValidation,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const customerReportValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

const inventoryReportValidation = [
  query('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  query('lowStock')
    .optional()
    .isBoolean()
    .withMessage('lowStock must be a boolean')
];

const cashierReportValidation = [
  ...dateRangeValidation
];

// Dashboard and general stats (accessible to all authenticated users)
router.get('/dashboard', authenticateToken, reportsController.getDashboardStats);

// Detailed reports (require manager access)
router.get('/sales', authenticateToken, requireManager, salesReportValidation, reportsController.getSalesReport);
router.get('/products', authenticateToken, requireManager, productSalesValidation, reportsController.getProductSalesReport);
router.get('/categories', authenticateToken, requireManager, dateRangeValidation, reportsController.getCategorySalesReport);
router.get('/inventory', authenticateToken, requireManager, inventoryReportValidation, reportsController.getInventoryReport);
router.get('/customers', authenticateToken, requireManager, customerReportValidation, reportsController.getCustomerReport);
router.get('/cashiers', authenticateToken, requireManager, cashierReportValidation, reportsController.getSalesByCashier);

module.exports = router;