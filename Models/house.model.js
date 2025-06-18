const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const House = sequelize.define(
  "House",
  {
    house_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    village_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Houses",
    timestamps: true,
  }
);

module.exports = House;
