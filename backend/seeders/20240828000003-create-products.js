'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, get category IDs
    const categories = await queryInterface.sequelize.query(
      'SELECT id, name FROM categories WHERE "isActive" = true',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    const products = [
      // Electronics
      {
        id: uuidv4(),
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        cost: 60.00,
        stock: 25,
        minStock: 5,
        barcode: '1234567890123',
        sku: 'WBH-001',
        categoryId: categoryMap['Electronics'],
        weight: 0.35,
        weightUnit: 'kg',
        supplier: 'TechSupplier Inc',
        tags: ['wireless', 'bluetooth', 'audio'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Smartphone Case',
        description: 'Protective case for smartphones',
        price: 19.99,
        cost: 8.00,
        stock: 50,
        minStock: 10,
        barcode: '1234567890124',
        sku: 'SPC-001',
        categoryId: categoryMap['Electronics'],
        weight: 0.05,
        weightUnit: 'kg',
        supplier: 'AccessoryWorld',
        tags: ['phone', 'protection', 'accessory'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'USB-C Charging Cable',
        description: '2m USB-C charging and data cable',
        price: 12.99,
        cost: 5.00,
        stock: 100,
        minStock: 20,
        barcode: '1234567890125',
        sku: 'USB-C-001',
        categoryId: categoryMap['Electronics'],
        weight: 0.1,
        weightUnit: 'kg',
        supplier: 'CableExpress',
        tags: ['usb-c', 'cable', 'charging'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Clothing
      {
        id: uuidv4(),
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 24.99,
        cost: 12.00,
        stock: 75,
        minStock: 15,
        barcode: '2234567890123',
        sku: 'CTS-001',
        categoryId: categoryMap['Clothing'],
        weight: 0.2,
        weightUnit: 'kg',
        supplier: 'Fashion Forward',
        tags: ['cotton', 'casual', 'comfort'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Denim Jeans',
        description: 'Classic blue denim jeans',
        price: 59.99,
        cost: 30.00,
        stock: 40,
        minStock: 8,
        barcode: '2234567890124',
        sku: 'DJ-001',
        categoryId: categoryMap['Clothing'],
        weight: 0.6,
        weightUnit: 'kg',
        supplier: 'Denim Co',
        tags: ['denim', 'jeans', 'casual'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Books
      {
        id: uuidv4(),
        name: 'Programming Guide',
        description: 'Complete guide to modern programming',
        price: 39.99,
        cost: 20.00,
        stock: 30,
        minStock: 5,
        barcode: '3234567890123',
        sku: 'PG-001',
        categoryId: categoryMap['Books'],
        weight: 0.5,
        weightUnit: 'kg',
        supplier: 'Educational Publishers',
        tags: ['programming', 'education', 'technical'],
        isTaxable: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Fiction Novel',
        description: 'Bestselling fiction novel',
        price: 14.99,
        cost: 7.00,
        stock: 60,
        minStock: 10,
        barcode: '3234567890124',
        sku: 'FN-001',
        categoryId: categoryMap['Books'],
        weight: 0.3,
        weightUnit: 'kg',
        supplier: 'Book Distributors',
        tags: ['fiction', 'novel', 'entertainment'],
        isTaxable: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Food & Beverages
      {
        id: uuidv4(),
        name: 'Premium Coffee Beans',
        description: 'Organic premium coffee beans 1kg',
        price: 29.99,
        cost: 15.00,
        stock: 20,
        minStock: 5,
        barcode: '4234567890123',
        sku: 'PCB-001',
        categoryId: categoryMap['Food & Beverages'],
        weight: 1.0,
        weightUnit: 'kg',
        supplier: 'Coffee Roasters Ltd',
        tags: ['coffee', 'organic', 'premium'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Green Tea',
        description: 'Organic green tea bags (25 count)',
        price: 12.99,
        cost: 6.00,
        stock: 45,
        minStock: 10,
        barcode: '4234567890124',
        sku: 'GT-001',
        categoryId: categoryMap['Food & Beverages'],
        weight: 0.15,
        weightUnit: 'kg',
        supplier: 'Tea Gardens',
        tags: ['tea', 'green', 'organic', 'healthy'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Home & Garden
      {
        id: uuidv4(),
        name: 'Plant Pot',
        description: 'Ceramic plant pot with drainage',
        price: 18.99,
        cost: 8.00,
        stock: 35,
        minStock: 8,
        barcode: '5234567890123',
        sku: 'PP-001',
        categoryId: categoryMap['Home & Garden'],
        weight: 1.2,
        weightUnit: 'kg',
        supplier: 'Garden Supplies Co',
        tags: ['plant', 'pot', 'ceramic', 'garden'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Sports & Outdoor
      {
        id: uuidv4(),
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat for exercise',
        price: 34.99,
        cost: 18.00,
        stock: 25,
        minStock: 5,
        barcode: '6234567890123',
        sku: 'YM-001',
        categoryId: categoryMap['Sports & Outdoor'],
        weight: 1.5,
        weightUnit: 'kg',
        supplier: 'Fitness Equipment Ltd',
        tags: ['yoga', 'fitness', 'exercise', 'mat'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Health & Beauty
      {
        id: uuidv4(),
        name: 'Face Moisturizer',
        description: 'Hydrating face moisturizer 50ml',
        price: 24.99,
        cost: 12.00,
        stock: 40,
        minStock: 8,
        barcode: '7234567890123',
        sku: 'FM-001',
        categoryId: categoryMap['Health & Beauty'],
        weight: 0.08,
        weightUnit: 'kg',
        supplier: 'Beauty Products Inc',
        tags: ['skincare', 'moisturizer', 'beauty'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Toys & Games
      {
        id: uuidv4(),
        name: 'Board Game',
        description: 'Strategic board game for 2-4 players',
        price: 45.99,
        cost: 25.00,
        stock: 15,
        minStock: 3,
        barcode: '8234567890123',
        sku: 'BG-001',
        categoryId: categoryMap['Toys & Games'],
        weight: 1.0,
        weightUnit: 'kg',
        supplier: 'Game Publishers',
        tags: ['board game', 'strategy', 'family'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Some products with low stock for testing
      {
        id: uuidv4(),
        name: 'Low Stock Item',
        description: 'Product with low stock for testing alerts',
        price: 15.99,
        cost: 8.00,
        stock: 2,
        minStock: 5,
        barcode: '9234567890123',
        sku: 'LSI-001',
        categoryId: categoryMap['Electronics'],
        weight: 0.1,
        weightUnit: 'kg',
        supplier: 'Test Supplier',
        tags: ['test', 'low-stock'],
        isTaxable: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('products', products, {});
    
    console.log('✅ Sample products created with various stock levels');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', {
      sku: {
        [Sequelize.Op.in]: [
          'WBH-001', 'SPC-001', 'USB-C-001', 'CTS-001', 'DJ-001',
          'PG-001', 'FN-001', 'PCB-001', 'GT-001', 'PP-001',
          'YM-001', 'FM-001', 'BG-001', 'LSI-001'
        ]
      }
    }, {});
  }
};