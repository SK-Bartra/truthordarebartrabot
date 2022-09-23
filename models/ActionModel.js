const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Action = sequelize.define(
  'tod-actions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    text: { type: DataTypes.STRING, unique: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Action;
