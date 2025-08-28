module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transactionNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'digital', 'points', 'mixed'),
      allowNull: false,
      defaultValue: 'cash'
    },
    paymentDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'refunded', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    receiptPrinted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    refundedAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    refundReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    loyaltyPointsEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true
      }
    },
    loyaltyPointsRedeemed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    shift: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      {
        fields: ['transactionNumber']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['customerId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['transactionDate']
      },
      {
        fields: ['paymentMethod']
      },
      {
        fields: ['total']
      }
    ],
    hooks: {
      beforeCreate: async (transaction) => {
        if (!transaction.transactionNumber) {
          // Generate transaction number: TXN-YYYYMMDD-HHMMSS-XXXX
          const now = new Date();
          const date = now.toISOString().slice(0, 10).replace(/-/g, '');
          const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
          const random = Math.floor(1000 + Math.random() * 9000);
          transaction.transactionNumber = `TXN-${date}-${time}-${random}`;
        }
      }
    }
  });

  // Instance methods
  Transaction.prototype.calculateTotals = function() {
    // This will be called to recalculate totals based on transaction items
    const taxRate = 0.08; // 8% tax rate, should be configurable
    
    this.tax = this.subtotal * taxRate;
    this.total = this.subtotal + this.tax - this.discount;
    
    return this;
  };

  Transaction.prototype.processRefund = async function(refundAmount, reason) {
    if (this.status !== 'completed') {
      throw new Error('Only completed transactions can be refunded');
    }
    
    if (refundAmount > (this.total - this.refundedAmount)) {
      throw new Error('Refund amount exceeds available amount');
    }
    
    this.refundedAmount = parseFloat(this.refundedAmount) + parseFloat(refundAmount);
    this.refundReason = reason;
    
    if (this.refundedAmount >= this.total) {
      this.status = 'refunded';
    }
    
    return await this.save();
  };

  Transaction.prototype.cancel = async function(reason) {
    if (this.status === 'completed') {
      throw new Error('Cannot cancel completed transactions');
    }
    
    this.status = 'cancelled';
    this.notes = reason;
    
    return await this.save();
  };

  Transaction.prototype.complete = async function() {
    this.status = 'completed';
    this.transactionDate = new Date();
    
    return await this.save();
  };

  Transaction.prototype.getItemsCount = async function() {
    const models = require('./index');
    const items = await models.TransactionItem.findAll({
      where: { transactionId: this.id }
    });
    
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Class methods
  Transaction.findByDateRange = function(startDate, endDate) {
    const { Op } = sequelize.Sequelize;
    return this.findAll({
      where: {
        transactionDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: sequelize.models.Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'membershipLevel']
        },
        {
          model: sequelize.models.TransactionItem,
          as: 'items',
          include: [{
            model: sequelize.models.Product,
            as: 'product',
            attributes: ['id', 'name', 'price']
          }]
        }
      ],
      order: [['transactionDate', 'DESC']]
    });
  };

  Transaction.findByTransactionNumber = function(transactionNumber) {
    return this.findOne({
      where: { transactionNumber },
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: sequelize.models.Customer,
          as: 'customer'
        },
        {
          model: sequelize.models.TransactionItem,
          as: 'items',
          include: [{
            model: sequelize.models.Product,
            as: 'product'
          }]
        }
      ]
    });
  };

  Transaction.getSalesReport = async function(startDate, endDate) {
    const { Op } = sequelize.Sequelize;
    const transactions = await this.findAll({
      where: {
        status: 'completed',
        transactionDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalTransactions'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('tax')), 'totalTax'],
        [sequelize.fn('SUM', sequelize.col('discount')), 'totalDiscount'],
        [sequelize.fn('AVG', sequelize.col('total')), 'averageTransaction']
      ],
      raw: true
    });
    
    return transactions[0];
  };

  // Associations
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Transaction.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    });
    
    Transaction.hasMany(models.TransactionItem, {
      foreignKey: 'transactionId',
      as: 'items'
    });
  };

  return Transaction;
};