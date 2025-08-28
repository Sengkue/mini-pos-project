const { Transaction, TransactionItem, Product, Customer, User } = require('../models');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class TransactionController {
  // Get all transactions
  async getAll(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        status, 
        paymentMethod,
        startDate,
        endDate,
        userId,
        customerId
      } = req.query;
      
      const offset = (page - 1) * limit;

      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { transactionNumber: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      if (paymentMethod) {
        whereClause.paymentMethod = paymentMethod;
      }

      if (userId) {
        whereClause.userId = userId;
      }

      if (customerId) {
        whereClause.customerId = customerId;
      }

      if (startDate && endDate) {
        whereClause.transactionDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const { rows: transactions, count } = await Transaction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'email', 'membershipLevel']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['transactionDate', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get all transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get transaction by ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Customer,
            as: 'customer'
          },
          {
            model: TransactionItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'barcode', 'sku', 'image']
            }]
          }
        ]
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: { transaction }
      });
    } catch (error) {
      logger.error('Get transaction by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get transaction by transaction number
  async getByTransactionNumber(req, res) {
    try {
      const { transactionNumber } = req.params;

      const transaction = await Transaction.findByTransactionNumber(transactionNumber);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: { transaction }
      });
    } catch (error) {
      logger.error('Get transaction by number error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create new transaction
  async create(req, res) {
    const transaction = await Transaction.sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        customerId,
        items,
        paymentMethod,
        paymentDetails,
        discount = 0,
        loyaltyPointsRedeemed = 0,
        notes
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Items are required'
        });
      }

      // Calculate subtotal and validate items
      let subtotal = 0;
      const processedItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction });

        if (!product) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          });
        }

        if (!product.isActive) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Product ${product.name} is not active`
          });
        }

        if (product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          });
        }

        const itemTotal = item.quantity * product.price;
        subtotal += itemTotal;

        processedItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
          productCost: product.cost
        });

        // Update product stock
        await product.updateStock(item.quantity, 'subtract', { transaction });
      }

      // Calculate tax (8% rate, should be configurable)
      const taxRate = 0.08;
      const tax = subtotal * taxRate;
      const total = subtotal + tax - discount - loyaltyPointsRedeemed;

      if (total < 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Total amount cannot be negative'
        });
      }

      // Create transaction
      const newTransaction = await Transaction.create({
        userId: req.user.id,
        customerId: customerId || null,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        paymentDetails: paymentDetails || {},
        loyaltyPointsRedeemed,
        notes,
        status: 'pending'
      }, { transaction });

      // Create transaction items
      for (const item of processedItems) {
        await TransactionItem.create({
          ...item,
          transactionId: newTransaction.id
        }, { transaction });
      }

      // Handle customer loyalty points
      if (customerId) {
        const customer = await Customer.findByPk(customerId, { transaction });
        if (customer) {
          // Redeem points if used
          if (loyaltyPointsRedeemed > 0) {
            await customer.redeemLoyaltyPoints(loyaltyPointsRedeemed);
          }
          
          // Add purchase to customer record
          await customer.addPurchase(total, { transaction });
          
          // Calculate loyalty points earned (1 point per dollar)
          const pointsEarned = Math.floor(total);
          newTransaction.loyaltyPointsEarned = pointsEarned;
          await newTransaction.save({ transaction });
        }
      }

      // Complete the transaction
      await newTransaction.complete({ transaction });

      await transaction.commit();

      // Fetch the complete transaction with all relations
      const completeTransaction = await Transaction.findByPk(newTransaction.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstName', 'lastName']
          },
          {
            model: Customer,
            as: 'customer'
          },
          {
            model: TransactionItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'barcode', 'sku']
            }]
          }
        ]
      });

      logger.info(`Transaction ${newTransaction.transactionNumber} created by ${req.user.username}`);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: { transaction: completeTransaction }
      });
    } catch (error) {
      await transaction.rollback();
      logger.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update transaction status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const validStatuses = ['pending', 'completed', 'refunded', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const transaction = await Transaction.findByPk(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      if (status === 'cancelled') {
        await transaction.cancel(reason);
      } else if (status === 'completed') {
        await transaction.complete();
      } else {
        transaction.status = status;
        if (reason) {
          transaction.notes = reason;
        }
        await transaction.save();
      }

      logger.info(`Transaction ${transaction.transactionNumber} status updated to ${status} by ${req.user.username}`);

      res.json({
        success: true,
        message: 'Transaction status updated successfully',
        data: { transaction }
      });
    } catch (error) {
      logger.error('Update transaction status error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  // Process refund
  async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { refundAmount, reason } = req.body;

      if (typeof refundAmount !== 'number' || refundAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Refund amount must be a positive number'
        });
      }

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: 'Refund reason is required'
        });
      }

      const transaction = await Transaction.findByPk(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      try {
        await transaction.processRefund(refundAmount, reason);

        logger.info(`Refund of ${refundAmount} processed for transaction ${transaction.transactionNumber} by ${req.user.username}`);

        res.json({
          success: true,
          message: 'Refund processed successfully',
          data: { transaction }
        });
      } catch (refundError) {
        res.status(400).json({
          success: false,
          message: refundError.message
        });
      }
    } catch (error) {
      logger.error('Process refund error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get transaction statistics
  async getStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          transactionDate: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        };
      }

      const totalTransactions = await Transaction.count({
        where: { ...dateFilter, status: 'completed' }
      });

      const totalSales = await Transaction.sum('total', {
        where: { ...dateFilter, status: 'completed' }
      });

      const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

      const transactionsByStatus = await Transaction.findAll({
        attributes: [
          'status',
          [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'count']
        ],
        where: dateFilter,
        group: ['status'],
        raw: true
      });

      const transactionsByPaymentMethod = await Transaction.findAll({
        attributes: [
          'paymentMethod',
          [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'count'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'total']
        ],
        where: { ...dateFilter, status: 'completed' },
        group: ['paymentMethod'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          totalTransactions,
          totalSales: totalSales || 0,
          averageTransaction: averageTransaction || 0,
          byStatus: transactionsByStatus,
          byPaymentMethod: transactionsByPaymentMethod
        }
      });
    } catch (error) {
      logger.error('Get transaction stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get daily sales report
  async getDailySales(req, res) {
    try {
      const { date = new Date().toISOString().split('T')[0] } = req.query;
      
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const salesReport = await Transaction.getSalesReport(startDate, endDate);

      res.json({
        success: true,
        data: {
          date,
          ...salesReport
        }
      });
    } catch (error) {
      logger.error('Get daily sales error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Mark receipt as printed
  async markReceiptPrinted(req, res) {
    try {
      const { id } = req.params;

      const transaction = await Transaction.findByPk(id);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      transaction.receiptPrinted = true;
      await transaction.save();

      res.json({
        success: true,
        message: 'Receipt marked as printed'
      });
    } catch (error) {
      logger.error('Mark receipt printed error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new TransactionController();