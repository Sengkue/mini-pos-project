const express = require('express');
const { body, param } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createTransactionValidation = [
  body('customerId')
    .optional()
    .isUUID()
    .withMessage('Customer ID must be a valid UUID'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  body('items.*.productId')
    .isUUID()
    .withMessage('Each item must have a valid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be a positive integer'),
  body('paymentMethod')
    .isIn(['cash', 'card', 'digital', 'points', 'mixed'])
    .withMessage('Payment method must be cash, card, digital, points, or mixed'),
  body('paymentDetails')
    .optional()
    .isObject()
    .withMessage('Payment details must be an object'),
  body('discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a non-negative number'),
  body('loyaltyPointsRedeemed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Loyalty points redeemed must be a non-negative integer'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'completed', 'refunded', 'cancelled'])
    .withMessage('Status must be pending, completed, refunded, or cancelled'),
  body('reason')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters')
];

const refundValidation = [
  body('refundAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Refund amount must be a positive number'),
  body('reason')
    .isLength({ min: 1, max: 500 })
    .withMessage('Refund reason is required and must not exceed 500 characters')
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid transaction ID format')
];

const transactionNumberValidation = [
  param('transactionNumber')
    .isLength({ min: 10 })
    .withMessage('Invalid transaction number format')
];

// Public routes (for POS interface)
router.get('/daily-sales', authenticateToken, transactionController.getDailySales);

// Protected routes
router.get('/', authenticateToken, transactionController.getAll);
router.get('/stats', authenticateToken, requireManager, transactionController.getStats);
router.get('/number/:transactionNumber', authenticateToken, transactionNumberValidation, transactionController.getByTransactionNumber);
router.get('/:id', authenticateToken, idValidation, transactionController.getById);

// Transaction creation and processing
router.post('/', authenticateToken, createTransactionValidation, transactionController.create);
router.put('/:id/status', authenticateToken, requireManager, idValidation, updateStatusValidation, transactionController.updateStatus);
router.post('/:id/refund', authenticateToken, requireManager, idValidation, refundValidation, transactionController.processRefund);
router.post('/:id/receipt-printed', authenticateToken, idValidation, transactionController.markReceiptPrinted);

module.exports = router;