module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    color: {
      type: DataTypes.STRING(7), // For hex color codes like #FF5733
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['sortOrder']
      }
    ]
  });

  // Instance methods
  Category.prototype.getActiveProductsCount = async function() {
    const models = require('./index');
    return await models.Product.count({
      where: { 
        categoryId: this.id,
        isActive: true 
      }
    });
  };

  // Class methods
  Category.findActive = function() {
    return this.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
  };

  Category.findByName = function(name) {
    return this.findOne({ 
      where: { name, isActive: true } 
    });
  };

  // Associations
  Category.associate = function(models) {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products'
    });
  };

  return Category;
};