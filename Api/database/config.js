const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  port: 5432,
});

module.exports = sequelize;