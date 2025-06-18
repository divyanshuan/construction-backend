const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Village = sequelize.define(
  "Village",
  {
    village_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Villages",
    timestamps: true,
  }
);

module.exports = Village;
