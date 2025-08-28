const { Customer, Transaction } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class CustomerController {
  // Get all customers
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        membershipLevel, 
        isActive,
        sortBy = 'name',
        sortOrder = 'ASC'
      } = req.query;
      
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (membershipLevel) {
        whereClause.membershipLevel = membershipLevel;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const { rows: customers, count } = await Customer.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get active customers (for dropdowns)
  async getActive(req, res) {
    try {
      const { search } = req.query;

      const whereClause = { isActive: true };

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const customers = await Customer.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'phone', 'membershipLevel', 'loyaltyPoints'],
        order: [['name', 'ASC']],
        limit: 50
      });

      res.json({
        success: true,
        data: { customers }
      });
    } catch (error) {
      logger.error('Get active customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get customer by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { includeTransactions } = req.query;

      const queryOptions = {
        where: { id }
      };

      if (includeTransactions === 'true') {
        queryOptions.include = [{
          model: Transaction,
          as: 'transactions',
          limit: 10,
          order: [['createdAt', 'DESC']]
        }];
      }

      const customer = await Customer.findOne(queryOptions);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: { customer }
      });
    } catch (error) {
      logger.error('Get customer by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Search customers
  async search(req, res) {
    try {
      const { q: searchTerm, limit = 20, offset = 0 } = req.query;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await Customer.searchCustomers(searchTerm, parseInt(limit), parseInt(offset));

      res.json({
        success: true,
        data: {
          customers: result.rows,
          total: result.count
        }
      });
    } catch (error) {
      logger.error('Search customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new customer
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
        email,
        phone,
        address,
        dateOfBirth,
        gender,
        notes,
        preferredPaymentMethod
      } = req.body;

      // Check if customer already exists
      const existingCustomer = await Customer.findOne({
        where: {
          [Op.or]: [
            ...(email ? [{ email }] : []),
            ...(phone ? [{ phone }] : [])
          ]
        }
      });

      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          message: 'Customer with this email or phone already exists'
        });
      }

      const customer = await Customer.create({
        name,
        email,
        phone,
        address,
        dateOfBirth,
        gender,
        notes,
        preferredPaymentMethod
      });

      logger.info(`Customer ${customer.name} created by ${req.user.username}`);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: { customer }
      });
    } catch (error) {
      logger.error('Create customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update customer
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

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Check if email or phone is already taken by another customer
      if (updateData.email || updateData.phone) {
        const whereClause = {
          id: { [Op.ne]: id }
        };

        if (updateData.email && updateData.phone) {
          whereClause[Op.or] = [
            { email: updateData.email },
            { phone: updateData.phone }
          ];
        } else if (updateData.email) {
          whereClause.email = updateData.email;
        } else if (updateData.phone) {
          whereClause.phone = updateData.phone;
        }

        const existingCustomer = await Customer.findOne({ where: whereClause });

        if (existingCustomer) {
          return res.status(409).json({
            success: false,
            message: 'Email or phone already taken by another customer'
          });
        }
      }

      await customer.update(updateData);

      logger.info(`Customer ${customer.name} updated by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: { customer }
      });
    } catch (error) {
      logger.error('Update customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete customer
  async delete(req, res) {
    try {
      const { id } = req.params;

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Check if customer has transactions
      const transactionCount = await Transaction.count({
        where: { customerId: id }
      });

      if (transactionCount > 0) {
        // Soft delete if customer has transaction history
        await customer.update({ isActive: false });
        
        logger.info(`Customer ${customer.name} deactivated by ${req.user.username}`);

        res.json({
          success: true,
          message: 'Customer deactivated successfully (has transaction history)'
        });
      } else {
        // Hard delete if no transaction history
        await customer.destroy();
        
        logger.info(`Customer ${customer.name} deleted by ${req.user.username}`);

        res.json({
          success: true,
          message: 'Customer deleted successfully'
        });
      }
    } catch (error) {
      logger.error('Delete customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Add loyalty points
  async addLoyaltyPoints(req, res) {
    try {
      const { id } = req.params;
      const { points } = req.body;

      if (typeof points !== 'number' || points <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Points must be a positive number'
        });
      }

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      await customer.addLoyaltyPoints(points);

      logger.info(`${points} loyalty points added to customer ${customer.name} by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Loyalty points added successfully',
        data: { customer }
      });
    } catch (error) {
      logger.error('Add loyalty points error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Redeem loyalty points
  async redeemLoyaltyPoints(req, res) {
    try {
      const { id } = req.params;
      const { points } = req.body;

      if (typeof points !== 'number' || points <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Points must be a positive number'
        });
      }

      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      try {
        await customer.redeemLoyaltyPoints(points);

        logger.info(`${points} loyalty points redeemed from customer ${customer.name} by ${req.user.username}`);

        res.json({
          success: true,
          message: 'Loyalty points redeemed successfully',
          data: { customer }
        });
      } catch (redemptionError) {
        res.status(400).json({
          success: false,
          message: redemptionError.message
        });
      }
    } catch (error) {
      logger.error('Redeem loyalty points error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get top customers
  async getTopCustomers(req, res) {
    try {
      const { limit = 10 } = req.query;

      const customers = await Customer.getTopCustomers(parseInt(limit));

      res.json({
        success: true,
        data: { customers }
      });
    } catch (error) {
      logger.error('Get top customers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get customer statistics
  async getStats(req, res) {
    try {
      const totalCustomers = await Customer.count();
      const activeCustomers = await Customer.count({ where: { isActive: true } });
      const inactiveCustomers = await Customer.count({ where: { isActive: false } });
      
      const customersByMembership = await Customer.findAll({
        attributes: [
          'membershipLevel',
          [Customer.sequelize.fn('COUNT', Customer.sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['membershipLevel'],
        raw: true
      });

      const totalLoyaltyPoints = await Customer.sum('loyaltyPoints', {
        where: { isActive: true }
      });

      res.json({
        success: true,
        data: {
          total: totalCustomers,
          active: activeCustomers,
          inactive: inactiveCustomers,
          byMembership: customersByMembership,
          totalLoyaltyPoints: totalLoyaltyPoints || 0
        }
      });
    } catch (error) {
      logger.error('Get customer stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new CustomerController();