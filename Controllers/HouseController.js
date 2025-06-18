const House = require("../Models/house.model");
const Village = require("../Models/village.model");
const MediaFile = require("../Models/mediafile.model");
const { verifyToken } = require("../utils/AuthJWT");

exports.createHouse = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  const { title, description } = req.body;
  const { villageId } = req.params;

  try {
    const village = await Village.findByPk(villageId);
    if (!village) return res.status(404).json({ message: "Village not found" });

    const house = await House.create({
      title,
      description,
      village_id: villageId,
    });

    res.status(201).json({ message: "House created", house });
  } catch (err) {
    res.status(500).json({ message: "Error creating house", error: err });
  }
};

exports.deleteHouse = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  const houseId = req.params.id;

  try {
    const house = await House.findByPk(houseId);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Delete files associated with this house
    await MediaFile.destroy({ where: { house_id: houseId } });

    await house.destroy();
    res.status(200).json({ message: "House and files deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting house", error: err });
  }
};

exports.getHousesByVillage = async (req, res) => {
  try {
    const { villageId } = req.params;
    const houses = await House.findAll({ where: { village_id: villageId } });

    res.status(200).json({ message: "Houses fetched", houses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching houses", error: err });
  }
};

exports.getHouseById = async (req, res) => {
  try {
    const house = await House.findOne({
      where: { house_id: req.params.id },
      include: [{ model: MediaFile, as: "MediaFiles" }],
    });

    if (!house) return res.status(404).json({ message: "House not found" });

    res.status(200).json({ message: "House fetched", house });
  } catch (err) {
    res.status(500).json({ message: "Error fetching house", error: err });
  }
};

// Get all houses
exports.getAllHouses = async (req, res) => {
  try {
    const houses = await House.findAll({
      include: [
        {
          model: Village,
          as: "Village", // match exactly with association alias
          attributes: ["village_id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ message: "All houses fetched", houses });
  } catch (err) {
    console.error("Error fetching houses:", err);
    res.status(500).json({ message: "Failed to fetch houses", error: err });
  }
};
