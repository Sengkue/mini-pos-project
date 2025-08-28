'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      address: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      loyaltyPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalSpent: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      membershipLevel: {
        type: Sequelize.ENUM('bronze', 'silver', 'gold', 'platinum'),
        defaultValue: 'bronze'
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastVisit: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      preferredPaymentMethod: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('customers', ['email']);
    await queryInterface.addIndex('customers', ['phone']);
    await queryInterface.addIndex('customers', ['name']);
    await queryInterface.addIndex('customers', ['loyaltyPoints']);
    await queryInterface.addIndex('customers', ['membershipLevel']);
    await queryInterface.addIndex('customers', ['isActive']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};