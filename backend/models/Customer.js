module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [10, 20]
      }
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true
      }
    },
    totalSpent: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    membershipLevel: {
      type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
      defaultValue: 'bronze'
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    lastVisit: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preferredPaymentMethod: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'customers',
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['phone']
      },
      {
        fields: ['name']
      },
      {
        fields: ['loyaltyPoints']
      },
      {
        fields: ['membershipLevel']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  // Instance methods
  Customer.prototype.addLoyaltyPoints = async function(points) {
    this.loyaltyPoints += points;
    await this.updateMembershipLevel();
    return await this.save();
  };

  Customer.prototype.redeemLoyaltyPoints = async function(points) {
    if (this.loyaltyPoints >= points) {
      this.loyaltyPoints -= points;
      return await this.save();
    }
    throw new Error('Insufficient loyalty points');
  };

  Customer.prototype.updateMembershipLevel = function() {
    if (this.totalSpent >= 10000) {
      this.membershipLevel = 'platinum';
    } else if (this.totalSpent >= 5000) {
      this.membershipLevel = 'gold';
    } else if (this.totalSpent >= 1000) {
      this.membershipLevel = 'silver';
    } else {
      this.membershipLevel = 'bronze';
    }
  };

  Customer.prototype.addPurchase = async function(amount) {
    this.totalSpent = parseFloat(this.totalSpent) + parseFloat(amount);
    this.lastVisit = new Date();
    
    // Award loyalty points (1 point per dollar spent)
    const pointsEarned = Math.floor(amount);
    await this.addLoyaltyPoints(pointsEarned);
    
    return await this.save();
  };

  Customer.prototype.getAge = function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  Customer.prototype.getDiscount = function() {
    const discounts = {
      bronze: 0,
      silver: 5,
      gold: 10,
      platinum: 15
    };
    return discounts[this.membershipLevel] || 0;
  };

  // Class methods
  Customer.findActive = function() {
    return this.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
  };

  Customer.findByEmail = function(email) {
    return this.findOne({
      where: { email, isActive: true }
    });
  };

  Customer.findByPhone = function(phone) {
    return this.findOne({
      where: { phone, isActive: true }
    });
  };

  Customer.searchCustomers = function(searchTerm, limit = 20, offset = 0) {
    const { Op } = sequelize.Sequelize;
    return this.findAndCountAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { email: { [Op.iLike]: `%${searchTerm}%` } },
          { phone: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      limit,
      offset,
      order: [['name', 'ASC']]
    });
  };

  Customer.getTopCustomers = function(limit = 10) {
    return this.findAll({
      where: { isActive: true },
      order: [['totalSpent', 'DESC']],
      limit
    });
  };

  // Associations
  Customer.associate = function(models) {
    Customer.hasMany(models.Transaction, {
      foreignKey: 'customerId',
      as: 'transactions'
    });
  };

  return Customer;
};