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
      references: {
        model: "Villages",
        key: "village_id",
      },
      onDelete: "CASCADE",
    },
    house_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Houses",
        key: "house_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "MediaFiles",
    timestamps: true,
  }
);

module.exports = MediaFile;
