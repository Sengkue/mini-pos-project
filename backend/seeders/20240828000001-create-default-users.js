'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 12;
    
    const users = [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@pos.com',
        password: await bcrypt.hash('admin123', saltRounds),
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true,
        phone: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'manager',
        email: 'manager@pos.com',
        password: await bcrypt.hash('manager123', saltRounds),
        firstName: 'Store',
        lastName: 'Manager',
        role: 'manager',
        isActive: true,
        phone: '+1234567891',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'cashier1',
        email: 'cashier1@pos.com',
        password: await bcrypt.hash('cashier123', saltRounds),
        firstName: 'John',
        lastName: 'Cashier',
        role: 'cashier',
        isActive: true,
        phone: '+1234567892',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'cashier2',
        email: 'cashier2@pos.com',
        password: await bcrypt.hash('cashier123', saltRounds),
        firstName: 'Jane',
        lastName: 'Cashier',
        role: 'cashier',
        isActive: true,
        phone: '+1234567893',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
    
    console.log('✅ Default users created:');
    console.log('   Admin: admin@pos.com / admin123');
    console.log('   Manager: manager@pos.com / manager123');
    console.log('   Cashier1: cashier1@pos.com / cashier123');
    console.log('   Cashier2: cashier2@pos.com / cashier123');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'admin@pos.com',
          'manager@pos.com',
          'cashier1@pos.com',
          'cashier2@pos.com'
        ]
      }
    }, {});
  }
};