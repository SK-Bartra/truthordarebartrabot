const { Sequelize } = require('sequelize');

module.exports = new Sequelize('bartra_bot_db', 'root', 'YgLCoRbAMeoS', {
  host: '109.71.12.132',
  port: '6432',
  dialect: 'postgres',
});
