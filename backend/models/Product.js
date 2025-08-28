module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true
      }
    },
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: 0,
        isInt: true
      }
    },
    barcode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        len: [8, 50]
      }
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isTaxable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    weight: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    weightUnit: {
      type: DataTypes.ENUM('kg', 'g', 'lb', 'oz'),
      defaultValue: 'kg'
    },
    supplier: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['barcode']
      },
      {
        fields: ['sku']
      },
      {
        fields: ['categoryId']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['stock']
      }
    ]
  });

  // Instance methods
  Product.prototype.isLowStock = function() {
    return this.stock <= this.minStock;
  };

  Product.prototype.updateStock = async function(quantity, operation = 'subtract') {
    if (operation === 'subtract') {
      this.stock = Math.max(0, this.stock - quantity);
    } else if (operation === 'add') {
      this.stock += quantity;
    } else {
      this.stock = quantity;
    }
    return await this.save();
  };

  Product.prototype.getMargin = function() {
    if (this.cost && this.cost > 0) {
      return ((this.price - this.cost) / this.cost * 100).toFixed(2);
    }
    return 0;
  };

  Product.prototype.getProfit = function() {
    return this.cost ? (this.price - this.cost).toFixed(2) : this.price;
  };

  // Class methods
  Product.findActive = function() {
    return this.findAll({
      where: { isActive: true },
      include: [{
        model: sequelize.models.Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      order: [['name', 'ASC']]
    });
  };

  Product.findByBarcode = function(barcode) {
    return this.findOne({
      where: { barcode, isActive: true },
      include: [{
        model: sequelize.models.Category,
        as: 'category'
      }]
    });
  };

  Product.findBySku = function(sku) {
    return this.findOne({
      where: { sku, isActive: true },
      include: [{
        model: sequelize.models.Category,
        as: 'category'
      }]
    });
  };

  Product.findLowStock = function() {
    return this.findAll({
      where: {
        isActive: true,
        [sequelize.Sequelize.Op.or]: [
          sequelize.where(
            sequelize.col('stock'),
            '<=',
            sequelize.col('minStock')
          )
        ]
      },
      include: [{
        model: sequelize.models.Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['stock', 'ASC']]
    });
  };

  Product.searchProducts = function(searchTerm, limit = 20, offset = 0) {
    const { Op } = sequelize.Sequelize;
    return this.findAndCountAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
          { barcode: { [Op.iLike]: `%${searchTerm}%` } },
          { sku: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      include: [{
        model: sequelize.models.Category,
        as: 'category',
        attributes: ['id', 'name', 'color']
      }],
      limit,
      offset,
      order: [['name', 'ASC']]
    });
  };

  // Associations
  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    Product.hasMany(models.TransactionItem, {
      foreignKey: 'productId',
      as: 'transactionItems'
    });
  };

  return Product;
};