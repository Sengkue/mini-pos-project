const { Category, Product } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class CategoryController {
  // Get all categories
  async getAll(req, res) {
    try {
      const { page = 1, limit = 50, search, isActive, includeProductCount } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const queryOptions = {
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['sortOrder', 'ASC'], ['name', 'ASC']]
      };

      if (includeProductCount === 'true') {
        queryOptions.include = [{
          model: Product,
          as: 'products',
          attributes: [],
          where: { isActive: true },
          required: false
        }];
        queryOptions.attributes = {
          include: [
            [Category.sequelize.fn('COUNT', Category.sequelize.col('products.id')), 'productCount']
          ]
        };
        queryOptions.group = ['Category.id'];
        queryOptions.subQuery = false;
      }

      const { rows: categories, count } = await Category.findAndCountAll(queryOptions);

      res.json({
        success: true,
        data: {
          categories,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get active categories (for dropdowns/selects)
  async getActive(req, res) {
    try {
      const categories = await Category.findActive();

      res.json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      logger.error('Get active categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get category by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { includeProducts } = req.query;

      const queryOptions = {
        where: { id }
      };

      if (includeProducts === 'true') {
        queryOptions.include = [{
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false
        }];
      }

      const category = await Category.findOne(queryOptions);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: { category }
      });
    } catch (error) {
      logger.error('Get category by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new category
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

      const { name, description, color, icon, sortOrder } = req.body;

      // Check if category name already exists
      const existingCategory = await Category.findByName(name);
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }

      const category = await Category.create({
        name,
        description,
        color,
        icon,
        sortOrder: sortOrder || 0
      });

      logger.info(`Category ${category.name} created by ${req.user.username}`);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error) {
      logger.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update category
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
      const { name, description, color, icon, sortOrder, isActive } = req.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if name is already taken by another category
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({
          where: {
            name: name,
            id: { [Op.ne]: id }
          }
        });

        if (existingCategory) {
          return res.status(409).json({
            success: false,
            message: 'Category name already taken'
          });
        }
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (color !== undefined) updateData.color = color;
      if (icon !== undefined) updateData.icon = icon;
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
      if (isActive !== undefined) updateData.isActive = isActive;

      await category.update(updateData);

      logger.info(`Category ${category.name} updated by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error) {
      logger.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete category
  async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Check if category has products
      const productCount = await Product.count({
        where: { categoryId: id, isActive: true }
      });

      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete category. It has ${productCount} active products.`
        });
      }

      await category.destroy();

      logger.info(`Category ${category.name} deleted by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      logger.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get category statistics
  async getStats(req, res) {
    try {
      const totalCategories = await Category.count();
      const activeCategories = await Category.count({ where: { isActive: true } });
      const inactiveCategories = await Category.count({ where: { isActive: false } });
      
      // Categories with product counts
      const categoriesWithProducts = await Category.findAll({
        attributes: [
          'id',
          'name',
          [Category.sequelize.fn('COUNT', Category.sequelize.col('products.id')), 'productCount']
        ],
        include: [{
          model: Product,
          as: 'products',
          attributes: [],
          where: { isActive: true },
          required: false
        }],
        where: { isActive: true },
        group: ['Category.id'],
        order: [[Category.sequelize.fn('COUNT', Category.sequelize.col('products.id')), 'DESC']],
        limit: 10,
        raw: true
      });

      res.json({
        success: true,
        data: {
          total: totalCategories,
          active: activeCategories,
          inactive: inactiveCategories,
          topCategories: categoriesWithProducts
        }
      });
    } catch (error) {
      logger.error('Get category stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Reorder categories
  async reorder(req, res) {
    try {
      const { categoryOrders } = req.body; // Array of { id, sortOrder }

      if (!Array.isArray(categoryOrders)) {
        return res.status(400).json({
          success: false,
          message: 'categoryOrders must be an array'
        });
      }

      // Update sort orders
      const updatePromises = categoryOrders.map(item => 
        Category.update(
          { sortOrder: item.sortOrder },
          { where: { id: item.id } }
        )
      );

      await Promise.all(updatePromises);

      logger.info(`Categories reordered by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Categories reordered successfully'
      });
    } catch (error) {
      logger.error('Reorder categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new CategoryController();