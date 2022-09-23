const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Chat = sequelize.define(
  'tod-chats',
  {
    // sequelize по умолчанию ставит во множественное число в таблице
    // freezeTableName: true  -- отключает это
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    //username: { type: DataTypes.STRING, unique: true },
    chatId: { type: DataTypes.BIGINT, unique: true },
    right: { type: DataTypes.INTEGER, defaultValue: 0 },
    wrong: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Chat;
