const House = require("../Models/house.model");
const Village = require("../Models/village.model");
const { verifyToken } = require("../utils/AuthJWT");

exports.createHouse = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description } = req.body;
  const { villageId } = req.params;

  try {
    const village = await Village.findByPk(villageId);
    if (!village) {
      return res.status(404).json({ message: "Village not found" });
    }

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

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const house = await House.findByPk(req.params.id);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    await house.destroy();
    res.status(200).json({ message: "House deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting house", error: err });
  }
};

exports.getHousesByVillage = async (req, res) => {
  try {
    const { villageId } = req.params;
    const houses = await House.findAll({
      where: { village_id: villageId },
    });

    res.status(200).json({ message: "Houses fetched", houses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching houses", error: err });
  }
};
