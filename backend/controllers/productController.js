const { Product, Category, TransactionItem } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class ProductController {
  // Get all products
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        categoryId, 
        isActive, 
        lowStock, 
        sortBy = 'name',
        sortOrder = 'ASC'
      } = req.query;
      
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { barcode: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      if (lowStock === 'true') {
        whereClause[Op.and] = [
          Product.sequelize.where(
            Product.sequelize.col('stock'),
            '<=',
            Product.sequelize.col('minStock')
          )
        ];
      }

      const { rows: products, count } = await Product.findAndCountAll({
        where: whereClause,
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get active products (for POS)
  async getActive(req, res) {
    try {
      const { categoryId, search } = req.query;

      const whereClause = { isActive: true };

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { barcode: { [Op.iLike]: `%${search}%` } },
          { sku: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'color']
        }],
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      logger.error('Get active products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get product by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [{
          model: Category,
          as: 'category'
        }]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: { product }
      });
    } catch (error) {
      logger.error('Get product by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get product by barcode
  async getByBarcode(req, res) {
    try {
      const { barcode } = req.params;

      const product = await Product.findByBarcode(barcode);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: { product }
      });
    } catch (error) {
      logger.error('Get product by barcode error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new product
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        name,
        description,
        price,
        cost,
        stock,
        minStock,
        barcode,
        sku,
        categoryId,
        weight,
        weightUnit,
        supplier,
        tags,
        isTaxable
      } = req.body;

      // Check if barcode or SKU already exists
      const existingProduct = await Product.findOne({
        where: {
          [Op.or]: [
            ...(barcode ? [{ barcode }] : []),
            ...(sku ? [{ sku }] : [])
          ]
        }
      });

      if (existingProduct) {
        return res.status(409).json({
          success: false,
          message: 'Product with this barcode or SKU already exists'
        });
      }

      const product = await Product.create({
        name,
        description,
        price,
        cost,
        stock: stock || 0,
        minStock: minStock || 5,
        barcode,
        sku,
        categoryId,
        weight,
        weightUnit,
        supplier,
        tags: tags || [],
        isTaxable: isTaxable !== undefined ? isTaxable : true
      });

      const productWithCategory = await Product.findByPk(product.id, {
        include: [{
          model: Category,
          as: 'category'
        }]
      });

      logger.info(`Product ${product.name} created by ${req.user.username}`);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product: productWithCategory }
      });
    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update product
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if barcode or SKU is already taken by another product
      if (updateData.barcode || updateData.sku) {
        const whereClause = {
          id: { [Op.ne]: id }
        };

        if (updateData.barcode && updateData.sku) {
          whereClause[Op.or] = [
            { barcode: updateData.barcode },
            { sku: updateData.sku }
          ];
        } else if (updateData.barcode) {
          whereClause.barcode = updateData.barcode;
        } else if (updateData.sku) {
          whereClause.sku = updateData.sku;
        }

        const existingProduct = await Product.findOne({ where: whereClause });

        if (existingProduct) {
          return res.status(409).json({
            success: false,
            message: 'Barcode or SKU already taken by another product'
          });
        }
      }

      await product.update(updateData);

      const updatedProduct = await Product.findByPk(id, {
        include: [{
          model: Category,
          as: 'category'
        }]
      });

      logger.info(`Product ${product.name} updated by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product: updatedProduct }
      });
    } catch (error) {
      logger.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update product stock
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, operation = 'set' } = req.body;

      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a non-negative number'
        });
      }

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await product.updateStock(quantity, operation);

      logger.info(`Product ${product.name} stock updated to ${product.stock} by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: { product }
      });
    } catch (error) {
      logger.error('Update stock error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete product
  async delete(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if product has been sold
      const transactionItemCount = await TransactionItem.count({
        where: { productId: id }
      });

      if (transactionItemCount > 0) {
        // Soft delete if product has sales history
        await product.update({ isActive: false });
        
        logger.info(`Product ${product.name} deactivated by ${req.user.username}`);

        res.json({
          success: true,
          message: 'Product deactivated successfully (has sales history)'
        });
      } else {
        // Hard delete if no sales history
        await product.destroy();
        
        logger.info(`Product ${product.name} deleted by ${req.user.username}`);

        res.json({
          success: true,
          message: 'Product deleted successfully'
        });
      }
    } catch (error) {
      logger.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get low stock products
  async getLowStock(req, res) {
    try {
      const products = await Product.findLowStock();

      res.json({
        success: true,
        data: { products }
      });
    } catch (error) {
      logger.error('Get low stock products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Search products
  async search(req, res) {
    try {
      const { q: searchTerm, limit = 20, offset = 0 } = req.query;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await Product.searchProducts(searchTerm, parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        data: {
          products: result.rows,
          total: result.count
        }
      });
    } catch (error) {
      logger.error('Search products error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get product statistics
  async getStats(req, res) {
    try {
      const totalProducts = await Product.count();
      const activeProducts = await Product.count({ where: { isActive: true } });
      const inactiveProducts = await Product.count({ where: { isActive: false } });
      const lowStockProducts = await Product.count({
        where: {
          isActive: true,
          [Op.and]: [
            Product.sequelize.where(
              Product.sequelize.col('stock'),
              '<=',
              Product.sequelize.col('minStock')
            )
          ]
        }
      });

      const outOfStockProducts = await Product.count({
        where: { isActive: true, stock: 0 }
      });

      const totalInventoryValue = await Product.sum('stock', {
        where: { isActive: true }
      });

      res.json({
        success: true,
        data: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
          totalInventoryValue: totalInventoryValue || 0
        }
      });
    } catch (error) {
      logger.error('Get product stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ProductController();