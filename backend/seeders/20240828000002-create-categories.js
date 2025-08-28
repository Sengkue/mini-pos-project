'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        id: uuidv4(),
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        color: '#2563eb',
        icon: 'electronics',
        sortOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Clothing',
        description: 'Clothing and apparel items',
        color: '#dc2626',
        icon: 'clothing',
        sortOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Books',
        description: 'Books and educational materials',
        color: '#059669',
        icon: 'book',
        sortOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Food & Beverages',
        description: 'Food items and beverages',
        color: '#d97706',
        icon: 'food',
        sortOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        color: '#7c3aed',
        icon: 'home',
        sortOrder: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sports & Outdoor',
        description: 'Sports equipment and outdoor gear',
        color: '#0891b2',
        icon: 'sports',
        sortOrder: 6,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Health & Beauty',
        description: 'Health and beauty products',
        color: '#be185d',
        icon: 'health',
        sortOrder: 7,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Toys & Games',
        description: 'Toys and gaming products',
        color: '#ea580c',
        icon: 'toys',
        sortOrder: 8,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, {});
    
    console.log('✅ Sample categories created');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', {
      name: {
        [Sequelize.Op.in]: [
          'Electronics',
          'Clothing',
          'Books',
          'Food & Beverages',
          'Home & Garden',
          'Sports & Outdoor',
          'Health & Beauty',
          'Toys & Games'
        ]
      }
    }, {});
  }
};