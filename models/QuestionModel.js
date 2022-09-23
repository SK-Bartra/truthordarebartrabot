const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Question = sequelize.define(
  'tod-questions',
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

module.exports = Question;
