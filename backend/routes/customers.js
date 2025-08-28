const express = require('express');
const { body, param } = require('express-validator');
const customerController = require('../controllers/customerController');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createCustomerValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name must be between 1 and 100 characters')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  body('preferredPaymentMethod')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Preferred payment method must not exceed 20 characters')
];

const updateCustomerValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Customer name must be between 1 and 100 characters')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  body('preferredPaymentMethod')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Preferred payment method must not exceed 20 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const loyaltyPointsValidation = [
  body('points')
    .isInt({ min: 1 })
    .withMessage('Points must be a positive integer')
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid customer ID format')
];

// Public routes (for POS interface)
router.get('/active', authenticateToken, customerController.getActive);
router.get('/search', authenticateToken, customerController.search);
router.get('/top', authenticateToken, customerController.getTopCustomers);

// Protected routes
router.get('/', authenticateToken, customerController.getAll);
router.get('/stats', authenticateToken, requireManager, customerController.getStats);
router.get('/:id', authenticateToken, idValidation, customerController.getById);
router.post('/', authenticateToken, createCustomerValidation, customerController.create);
router.put('/:id', authenticateToken, idValidation, updateCustomerValidation, customerController.update);
router.delete('/:id', authenticateToken, requireManager, idValidation, customerController.delete);

// Loyalty points management
router.post('/:id/loyalty-points/add', authenticateToken, idValidation, loyaltyPointsValidation, customerController.addLoyaltyPoints);
router.post('/:id/loyalty-points/redeem', authenticateToken, idValidation, loyaltyPointsValidation, customerController.redeemLoyaltyPoints);

module.exports = router;