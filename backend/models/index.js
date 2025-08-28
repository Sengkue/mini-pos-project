const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Models object to hold all models
const db = {};

// Import models
db.User = require('./User')(sequelize, DataTypes);
db.Category = require('./Category')(sequelize, DataTypes);
db.Product = require('./Product')(sequelize, DataTypes);
db.Customer = require('./Customer')(sequelize, DataTypes);
db.Transaction = require('./Transaction')(sequelize, DataTypes);
db.TransactionItem = require('./TransactionItem')(sequelize, DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testConnection = testConnection;

module.exports = db;