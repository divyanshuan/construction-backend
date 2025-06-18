const Village = require("./village.model");
const House = require("./house.model");
const MediaFile = require("./mediafile.model");

const associateModels = () => {
  // Village ↔ Houses
  Village.hasMany(House, {
    foreignKey: "village_id",
    as: "Houses",
    onDelete: "CASCADE",
    constraints: true,
  });

  House.belongsTo(Village, {
    foreignKey: "village_id",
    as: "Village",
    onDelete: "CASCADE",
    constraints: true,
  });

  // Village ↔ MediaFiles (village-level files)
  Village.hasMany(MediaFile, {
    foreignKey: "village_id",
    as: "MediaFiles",
    onDelete: "CASCADE",
    constraints: true,
  });

  MediaFile.belongsTo(Village, {
    foreignKey: "village_id",
    as: "Village",
    onDelete: "CASCADE",
    constraints: true,
  });

  // House ↔ MediaFiles (house-level files)
  House.hasMany(MediaFile, {
    foreignKey: "house_id",
    as: "MediaFiles",
    onDelete: "CASCADE",
    constraints: true,
  });

  MediaFile.belongsTo(House, {
    foreignKey: "house_id",
    as: "House",
    onDelete: "CASCADE",
    constraints: true,
  });
};

module.exports = associateModels;
