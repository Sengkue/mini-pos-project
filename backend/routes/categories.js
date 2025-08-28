const express = require('express');
const { body, param } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createCategoryValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
  body('icon')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Icon must not exceed 50 characters'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category name must be between 1 and 100 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
    .trim(),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
  body('icon')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Icon must not exceed 50 characters'),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sort order must be a non-negative integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const reorderValidation = [
  body('categoryOrders')
    .isArray()
    .withMessage('categoryOrders must be an array'),
  body('categoryOrders.*.id')
    .isUUID()
    .withMessage('Each category ID must be a valid UUID'),
  body('categoryOrders.*.sortOrder')
    .isInt({ min: 0 })
    .withMessage('Each sort order must be a non-negative integer')
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid category ID format')
];

// Public routes (for POS interface)
router.get('/active', authenticateToken, categoryController.getActive);

// Protected routes
router.get('/', authenticateToken, categoryController.getAll);
router.get('/stats', authenticateToken, requireManager, categoryController.getStats);
router.get('/:id', authenticateToken, idValidation, categoryController.getById);
router.post('/', authenticateToken, requireManager, createCategoryValidation, categoryController.create);
router.put('/:id', authenticateToken, requireManager, idValidation, updateCategoryValidation, categoryController.update);
router.delete('/:id', authenticateToken, requireManager, idValidation, categoryController.delete);
router.post('/reorder', authenticateToken, requireManager, reorderValidation, categoryController.reorder);

module.exports = router;