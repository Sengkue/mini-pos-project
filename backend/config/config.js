require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '123',
    database: process.env.DB_NAME || 'txivfeej-shop',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      underscoredAll: false,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '123',
    database: process.env.DB_NAME + '_test' || 'txivfeej-shop_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      underscoredAll: false,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
};