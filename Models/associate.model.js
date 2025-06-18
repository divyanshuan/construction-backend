const Village = require("./village.model");
const House = require("./house.model");
const MediaFile = require("./mediafile.model");

const associateModels = () => {
  // Village ↔ Houses
  Village.hasMany(House, { foreignKey: "village_id", as: "Houses" });
  House.belongsTo(Village, { foreignKey: "village_id", as: "Village" });

  // Village ↔ MediaFiles
  Village.hasMany(MediaFile, { foreignKey: "village_id", as: "MediaFiles" });
  MediaFile.belongsTo(Village, { foreignKey: "village_id", as: "Village" });

  // House ↔ MediaFiles
  House.hasMany(MediaFile, { foreignKey: "house_id", as: "MediaFiles" });
  MediaFile.belongsTo(House, { foreignKey: "house_id", as: "House" });
};

module.exports = associateModels;
