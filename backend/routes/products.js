const express = require('express');
const { body, param } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createProductValidation = [
  body('name')
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('minStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock must be a non-negative integer'),
  body('barcode')
    .optional()
    .isLength({ min: 8, max: 50 })
    .withMessage('Barcode must be between 8 and 50 characters'),
  body('sku')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU must be between 1 and 50 characters'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a non-negative number'),
  body('weightUnit')
    .optional()
    .isIn(['kg', 'g', 'lb', 'oz'])
    .withMessage('Weight unit must be kg, g, lb, or oz'),
  body('supplier')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Supplier name must not exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isTaxable')
    .optional()
    .isBoolean()
    .withMessage('isTaxable must be a boolean')
];

const updateProductValidation = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('minStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock must be a non-negative integer'),
  body('barcode')
    .optional()
    .isLength({ min: 8, max: 50 })
    .withMessage('Barcode must be between 8 and 50 characters'),
  body('sku')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU must be between 1 and 50 characters'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a non-negative number'),
  body('weightUnit')
    .optional()
    .isIn(['kg', 'g', 'lb', 'oz'])
    .withMessage('Weight unit must be kg, g, lb, or oz'),
  body('supplier')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Supplier name must not exceed 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isTaxable')
    .optional()
    .isBoolean()
    .withMessage('isTaxable must be a boolean'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

const updateStockValidation = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('operation')
    .optional()
    .isIn(['set', 'add', 'subtract'])
    .withMessage('Operation must be set, add, or subtract')
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid product ID format')
];

const barcodeValidation = [
  param('barcode')
    .isLength({ min: 8, max: 50 })
    .withMessage('Invalid barcode format')
];

// Public routes (for POS interface)
router.get('/active', authenticateToken, productController.getActive);
router.get('/search', authenticateToken, productController.search);
router.get('/barcode/:barcode', authenticateToken, barcodeValidation, productController.getByBarcode);
router.get('/low-stock', authenticateToken, productController.getLowStock);

// Protected routes
router.get('/', authenticateToken, productController.getAll);
router.get('/stats', authenticateToken, requireManager, productController.getStats);
router.get('/:id', authenticateToken, idValidation, productController.getById);
router.post('/', authenticateToken, requireManager, createProductValidation, productController.create);
router.put('/:id', authenticateToken, requireManager, idValidation, updateProductValidation, productController.update);
router.put('/:id/stock', authenticateToken, requireManager, idValidation, updateStockValidation, productController.updateStock);
router.delete('/:id', authenticateToken, requireManager, idValidation, productController.delete);

module.exports = router;