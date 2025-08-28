module.exports = (sequelize, DataTypes) => {
  const TransactionItem = sequelize.define('TransactionItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    },
    productName: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        isInt: true
      }
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    discountType: {
      type: DataTypes.ENUM('amount', 'percentage'),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refundedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true
      }
    },
    productCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
        isDecimal: true
      }
    }
  }, {
    tableName: 'transaction_items',
    timestamps: true,
    indexes: [
      {
        fields: ['transactionId']
      },
      {
        fields: ['productId']
      },
      {
        fields: ['productName']
      }
    ],
    hooks: {
      beforeCreate: (item) => {
        item.totalPrice = item.quantity * item.unitPrice - item.discount;
      },
      beforeUpdate: (item) => {
        if (item.changed('quantity') || item.changed('unitPrice') || item.changed('discount')) {
          item.totalPrice = item.quantity * item.unitPrice - item.discount;
        }
      }
    }
  });

  // Instance methods
  TransactionItem.prototype.calculateTotal = function() {
    this.totalPrice = (this.quantity * this.unitPrice) - this.discount;
    return this.totalPrice;
  };

  TransactionItem.prototype.applyDiscount = function(discountAmount, discountType = 'amount') {
    this.discount = discountAmount;
    this.discountType = discountType;
    
    if (discountType === 'percentage') {
      this.discount = (this.quantity * this.unitPrice) * (discountAmount / 100);
    }
    
    this.calculateTotal();
    return this;
  };

  TransactionItem.prototype.refund = async function(refundQuantity) {
    if (refundQuantity > (this.quantity - this.refundedQuantity)) {
      throw new Error('Refund quantity exceeds available quantity');
    }
    
    this.refundedQuantity += refundQuantity;
    return await this.save();
  };

  TransactionItem.prototype.getProfit = function() {
    if (this.productCost) {
      const totalCost = this.productCost * this.quantity;
      return this.totalPrice - totalCost;
    }
    return 0;
  };

  TransactionItem.prototype.getMargin = function() {
    if (this.productCost && this.productCost > 0) {
      const profit = this.getProfit();
      const totalCost = this.productCost * this.quantity;
      return ((profit / totalCost) * 100).toFixed(2);
    }
    return 0;
  };

  // Class methods
  TransactionItem.findByTransaction = function(transactionId) {
    return this.findAll({
      where: { transactionId },
      include: [{
        model: sequelize.models.Product,
        as: 'product',
        attributes: ['id', 'name', 'barcode', 'sku', 'image']
      }],
      order: [['createdAt', 'ASC']]
    });
  };

  TransactionItem.getTopSellingProducts = async function(startDate, endDate, limit = 10) {
    const { Op } = sequelize.Sequelize;
    
    return await this.findAll({
      attributes: [
        'productId',
        'productName',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('TransactionItem.id')), 'transactionCount']
      ],
      include: [{
        model: sequelize.models.Transaction,
        as: 'transaction',
        where: {
          status: 'completed',
          transactionDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: []
      }, {
        model: sequelize.models.Product,
        as: 'product',
        attributes: ['id', 'name', 'price', 'image']
      }],
      group: ['productId', 'productName', 'product.id'],
      order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
      limit
    });
  };

  TransactionItem.getProductSalesReport = async function(productId, startDate, endDate) {
    const { Op } = sequelize.Sequelize;
    
    return await this.findAll({
      where: { productId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('TransactionItem.id')), 'transactionCount'],
        [sequelize.fn('AVG', sequelize.col('unitPrice')), 'averagePrice']
      ],
      include: [{
        model: sequelize.models.Transaction,
        as: 'transaction',
        where: {
          status: 'completed',
          transactionDate: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: []
      }],
      raw: true
    });
  };

  // Associations
  TransactionItem.associate = function(models) {
    TransactionItem.belongsTo(models.Transaction, {
      foreignKey: 'transactionId',
      as: 'transaction'
    });
    
    TransactionItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return TransactionItem;
};