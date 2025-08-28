'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      transactionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      productName: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      discountType: {
        type: Sequelize.ENUM('amount', 'percentage'),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      refundedQuantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      productCost: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.addIndex('transaction_items', ['transactionId']);
    await queryInterface.addIndex('transaction_items', ['productId']);
    await queryInterface.addIndex('transaction_items', ['productName']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_items');
  }
};