const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const MediaFile = sequelize.define(
  "MediaFile",
  {
    file_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING,
    },
    village_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    house_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "MediaFiles",
    timestamps: true,
  }
);

module.exports = MediaFile;
