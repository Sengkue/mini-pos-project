const { Transaction, TransactionItem, Product, Customer, User, Category } = require('../models');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class ReportsController {
  // Get sales report
  async getSalesReport(req, res) {
    try {
      const { startDate, endDate, groupBy = 'day' } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Basic sales metrics
      const basicStats = await Transaction.findOne({
        where: {
          status: 'completed',
          transactionDate: { [Op.between]: [start, end] }
        },
        attributes: [
          [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'totalTransactions'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'totalSales'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('tax')), 'totalTax'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('discount')), 'totalDiscount'],
          [Transaction.sequelize.fn('AVG', Transaction.sequelize.col('total')), 'averageTransaction']
        ],
        raw: true
      });

      // Sales by period
      let dateFormat;
      switch (groupBy) {
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00:00';
          break;
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-%u';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }

      const salesByPeriod = await Transaction.findAll({
        where: {
          status: 'completed',
          transactionDate: { [Op.between]: [start, end] }
        },
        attributes: [
          [Transaction.sequelize.fn('DATE_TRUNC', groupBy, Transaction.sequelize.col('transactionDate')), 'period'],
          [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'transactions'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'sales']
        ],
        group: [Transaction.sequelize.fn('DATE_TRUNC', groupBy, Transaction.sequelize.col('transactionDate'))],
        order: [[Transaction.sequelize.fn('DATE_TRUNC', groupBy, Transaction.sequelize.col('transactionDate')), 'ASC']],
        raw: true
      });

      // Sales by payment method
      const salesByPaymentMethod = await Transaction.findAll({
        where: {
          status: 'completed',
          transactionDate: { [Op.between]: [start, end] }
        },
        attributes: [
          'paymentMethod',
          [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'transactions'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'sales']
        ],
        group: ['paymentMethod'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          period: { startDate, endDate },
          summary: {
            totalTransactions: parseInt(basicStats.totalTransactions) || 0,
            totalSales: parseFloat(basicStats.totalSales) || 0,
            totalTax: parseFloat(basicStats.totalTax) || 0,
            totalDiscount: parseFloat(basicStats.totalDiscount) || 0,
            averageTransaction: parseFloat(basicStats.averageTransaction) || 0
          },
          salesByPeriod,
          salesByPaymentMethod
        }
      });
    } catch (error) {
      logger.error('Get sales report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get product sales report
  async getProductSalesReport(req, res) {
    try {
      const { startDate, endDate, limit = 20 } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const topSellingProducts = await TransactionItem.getTopSellingProducts(start, end, parseInt(limit));

      res.json({
        success: true,
        data: {
          period: { startDate, endDate },
          topSellingProducts
        }
      });
    } catch (error) {
      logger.error('Get product sales report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get category sales report
  async getCategorySalesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const categorySales = await TransactionItem.findAll({
        attributes: [
          [TransactionItem.sequelize.fn('SUM', TransactionItem.sequelize.col('quantity')), 'totalQuantity'],
          [TransactionItem.sequelize.fn('SUM', TransactionItem.sequelize.col('totalPrice')), 'totalRevenue'],
          [TransactionItem.sequelize.fn('COUNT', TransactionItem.sequelize.col('TransactionItem.id')), 'transactionCount']
        ],
        include: [
          {
            model: Transaction,
            as: 'transaction',
            where: {
              status: 'completed',
              transactionDate: { [Op.between]: [start, end] }
            },
            attributes: []
          },
          {
            model: Product,
            as: 'product',
            attributes: ['categoryId'],
            include: [{
              model: Category,
              as: 'category',
              attributes: ['id', 'name', 'color']
            }]
          }
        ],
        group: [
          'product.categoryId',
          'product.category.id',
          'product.category.name',
          'product.category.color'
        ],
        order: [[TransactionItem.sequelize.fn('SUM', TransactionItem.sequelize.col('totalPrice')), 'DESC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          period: { startDate, endDate },
          categorySales
        }
      });
    } catch (error) {
      logger.error('Get category sales report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get inventory report
  async getInventoryReport(req, res) {
    try {
      const { categoryId, lowStock } = req.query;

      const whereClause = { isActive: true };

      if (categoryId) {
        whereClause.categoryId = categoryId;
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

      const products = await Product.findAll({
        where: whereClause,
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['stock', 'ASC'], ['name', 'ASC']]
      });

      // Calculate inventory statistics
      const totalProducts = products.length;
      const totalInventoryValue = products.reduce((sum, product) => {
        return sum + (parseFloat(product.stock) * parseFloat(product.price));
      }, 0);

      const lowStockCount = products.filter(product => product.isLowStock()).length;
      const outOfStockCount = products.filter(product => product.stock === 0).length;

      res.json({
        success: true,
        data: {
          summary: {
            totalProducts,
            totalInventoryValue,
            lowStockCount,
            outOfStockCount
          },
          products
        }
      });
    } catch (error) {
      logger.error('Get inventory report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get customer report
  async getCustomerReport(req, res) {
    try {
      const { startDate, endDate, limit = 20 } = req.query;

      const whereClause = { isActive: true };
      let transactionFilter = {};

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        transactionFilter = {
          transactionDate: { [Op.between]: [start, end] }
        };
      }

      // Top customers by total spent
      const topCustomers = await Customer.findAll({
        where: whereClause,
        attributes: [
          'id', 'name', 'email', 'membershipLevel', 'loyaltyPoints', 'totalSpent',
          [Customer.sequelize.fn('COUNT', Customer.sequelize.col('transactions.id')), 'transactionCount']
        ],
        include: [{
          model: Transaction,
          as: 'transactions',
          where: { status: 'completed', ...transactionFilter },
          attributes: [],
          required: true
        }],
        group: ['Customer.id'],
        order: [['totalSpent', 'DESC']],
        limit: parseInt(limit)
      });

      // Customer statistics
      const customerStats = await Customer.findAll({
        attributes: [
          'membershipLevel',
          [Customer.sequelize.fn('COUNT', Customer.sequelize.col('id')), 'count'],
          [Customer.sequelize.fn('SUM', Customer.sequelize.col('totalSpent')), 'totalSpent'],
          [Customer.sequelize.fn('SUM', Customer.sequelize.col('loyaltyPoints')), 'totalLoyaltyPoints']
        ],
        where: whereClause,
        group: ['membershipLevel'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          period: startDate && endDate ? { startDate, endDate } : null,
          topCustomers,
          customerStats
        }
      });
    } catch (error) {
      logger.error('Get customer report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req, res) {
    try {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Today's sales
      const todaySales = await Transaction.getSalesReport(startOfDay, endOfDay);

      // This week's sales
      const weekSales = await Transaction.getSalesReport(startOfWeek, endOfDay);

      // This month's sales
      const monthSales = await Transaction.getSalesReport(startOfMonth, endOfDay);

      // Product statistics
      const productStats = {
        total: await Product.count({ where: { isActive: true } }),
        lowStock: await Product.count({
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
        }),
        outOfStock: await Product.count({ where: { isActive: true, stock: 0 } })
      };

      // Customer statistics
      const customerStats = {
        total: await Customer.count({ where: { isActive: true } }),
        new: await Customer.count({
          where: {
            isActive: true,
            createdAt: { [Op.gte]: startOfDay }
          }
        })
      };

      // Recent transactions
      const recentTransactions = await Transaction.findAll({
        where: { status: 'completed' },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username']
          },
          {
            model: Customer,
            as: 'customer',
            attributes: ['name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Top selling products today
      const topProducts = await TransactionItem.getTopSellingProducts(startOfDay, endOfDay, 5);

      res.json({
        success: true,
        data: {
          sales: {
            today: todaySales,
            week: weekSales,
            month: monthSales
          },
          products: productStats,
          customers: customerStats,
          recentTransactions,
          topProducts
        }
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get sales by cashier report
  async getSalesByCashier(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const salesByCashier = await Transaction.findAll({
        where: {
          status: 'completed',
          transactionDate: { [Op.between]: [start, end] }
        },
        attributes: [
          [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('Transaction.id')), 'transactions'],
          [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'totalSales'],
          [Transaction.sequelize.fn('AVG', Transaction.sequelize.col('total')), 'averageTransaction']
        ],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }],
        group: ['user.id', 'user.username', 'user.firstName', 'user.lastName'],
        order: [[Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'DESC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          period: { startDate, endDate },
          salesByCashier
        }
      });
    } catch (error) {
      logger.error('Get sales by cashier error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ReportsController();