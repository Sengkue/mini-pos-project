'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const customers = [
      {
        id: uuidv4(),
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1555-0101',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        loyaltyPoints: 150,
        totalSpent: 850.00,
        membershipLevel: 'silver',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 3), // 3 days ago
        notes: 'Prefers electronic receipts',
        preferredPaymentMethod: 'card',
        createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1555-0102',
        address: {
          street: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA'
        },
        loyaltyPoints: 320,
        totalSpent: 2100.00,
        membershipLevel: 'gold',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 1), // 1 day ago
        notes: 'Always asks about new arrivals',
        preferredPaymentMethod: 'digital',
        createdAt: new Date(Date.now() - 86400000 * 60), // 60 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1555-0103',
        address: {
          street: '789 Pine Rd',
          city: 'Portland',
          state: 'OR',
          zipCode: '97201',
          country: 'USA'
        },
        loyaltyPoints: 75,
        totalSpent: 450.00,
        membershipLevel: 'bronze',
        dateOfBirth: '1975-12-08',
        gender: 'male',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 7), // 1 week ago
        notes: 'Usually shops during lunch hours',
        preferredPaymentMethod: 'cash',
        createdAt: new Date(Date.now() - 86400000 * 45), // 45 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1555-0104',
        address: {
          street: '321 Elm St',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA'
        },
        loyaltyPoints: 850,
        totalSpent: 12500.00,
        membershipLevel: 'platinum',
        dateOfBirth: '1988-05-14',
        gender: 'female',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 2), // 2 days ago
        notes: 'VIP customer, very loyal',
        preferredPaymentMethod: 'card',
        createdAt: new Date(Date.now() - 86400000 * 180), // 180 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1555-0105',
        address: {
          street: '654 Maple Dr',
          city: 'Denver',
          state: 'CO',
          zipCode: '80201',
          country: 'USA'
        },
        loyaltyPoints: 200,
        totalSpent: 1200.00,
        membershipLevel: 'silver',
        dateOfBirth: '1982-09-30',
        gender: 'male',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 5), // 5 days ago
        notes: 'Interested in tech products',
        preferredPaymentMethod: 'digital',
        createdAt: new Date(Date.now() - 86400000 * 90), // 90 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Lisa Martinez',
        email: 'lisa.martinez@email.com',
        phone: '+1555-0106',
        address: {
          street: '987 Cedar Ln',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101',
          country: 'USA'
        },
        loyaltyPoints: 50,
        totalSpent: 185.00,
        membershipLevel: 'bronze',
        dateOfBirth: '1995-01-18',
        gender: 'female',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 10), // 10 days ago
        notes: 'Student discount applied',
        preferredPaymentMethod: 'card',
        createdAt: new Date(Date.now() - 86400000 * 20), // 20 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Robert Taylor',
        email: 'robert.taylor@email.com',
        phone: '+1555-0107',
        address: {
          street: '147 Birch Ave',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA'
        },
        loyaltyPoints: 400,
        totalSpent: 3200.00,
        membershipLevel: 'gold',
        dateOfBirth: '1978-11-25',
        gender: 'male',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 1), // 1 day ago
        notes: 'Bulk purchaser, wholesale pricing',
        preferredPaymentMethod: 'card',
        createdAt: new Date(Date.now() - 86400000 * 120), // 120 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Jennifer Anderson',
        email: 'jennifer.anderson@email.com',
        phone: '+1555-0108',
        address: {
          street: '258 Spruce St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        loyaltyPoints: 125,
        totalSpent: 680.00,
        membershipLevel: 'bronze',
        dateOfBirth: '1987-04-12',
        gender: 'female',
        isActive: true,
        lastVisit: new Date(Date.now() - 86400000 * 6), // 6 days ago
        notes: 'Environmentally conscious buyer',
        preferredPaymentMethod: 'digital',
        createdAt: new Date(Date.now() - 86400000 * 75), // 75 days ago
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Guest Customer',
        email: null,
        phone: null,
        address: {},
        loyaltyPoints: 0,
        totalSpent: 0,
        membershipLevel: 'bronze',
        dateOfBirth: null,
        gender: null,
        isActive: true,
        lastVisit: null,
        notes: 'Walk-in guest customer for cash transactions',
        preferredPaymentMethod: 'cash',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('customers', customers, {});
    
    console.log('✅ Sample customers created with various membership levels');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', {
      email: {
        [Sequelize.Op.in]: [
          'john.smith@email.com',
          'sarah.johnson@email.com',
          'michael.brown@email.com',
          'emily.davis@email.com',
          'david.wilson@email.com',
          'lisa.martinez@email.com',
          'robert.taylor@email.com',
          'jennifer.anderson@email.com'
        ]
      }
    }, {});
    
    await queryInterface.bulkDelete('customers', {
      name: 'Guest Customer'
    }, {});
  }
};