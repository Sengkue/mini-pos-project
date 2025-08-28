'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      transactionNumber: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      subtotal: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      total: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'card', 'digital', 'points', 'mixed'),
        allowNull: false,
        defaultValue: 'cash'
      },
      paymentDetails: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'refunded', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      receiptPrinted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      refundedAmount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      refundReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      loyaltyPointsEarned: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      loyaltyPointsRedeemed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      shift: {
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
    await queryInterface.addIndex('transactions', ['transactionNumber']);
    await queryInterface.addIndex('transactions', ['userId']);
    await queryInterface.addIndex('transactions', ['customerId']);
    await queryInterface.addIndex('transactions', ['status']);
    await queryInterface.addIndex('transactions', ['transactionDate']);
    await queryInterface.addIndex('transactions', ['paymentMethod']);
    await queryInterface.addIndex('transactions', ['total']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};