'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      minStock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      barcode: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      sku: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      isTaxable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      weight: {
        type: Sequelize.DECIMAL(8, 3),
        allowNull: true
      },
      weightUnit: {
        type: Sequelize.ENUM('kg', 'g', 'lb', 'oz'),
        defaultValue: 'kg'
      },
      supplier: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
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
    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['barcode']);
    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['categoryId']);
    await queryInterface.addIndex('products', ['isActive']);
    await queryInterface.addIndex('products', ['stock']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};