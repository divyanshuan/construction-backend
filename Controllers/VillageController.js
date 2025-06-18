const Village = require("../Models/village.model");
const { verifyToken } = require("../utils/AuthJWT");

exports.createVillage = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, pin, description } = req.body;

  try {
    const village = await Village.create({
      name,
      pin,
      description,
      user_id: decoded.user_id,
    });

    res.status(201).json({ message: "Village created", village });
  } catch (err) {
    res.status(500).json({ message: "Error creating village", error: err });
  }
};

exports.deleteVillage = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await Village.destroy({
      where: {
        village_id: req.params.id,
        user_id: decoded.user_id,
      },
    });

    if (result === 0) {
      return res.status(404).json({ message: "Village not found" });
    }

    res.status(200).json({ message: "Village deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting village", error: err });
  }
};

exports.getAllVillages = async (req, res) => {
  try {
    const villages = await Village.findAll();

    res.status(200).json({
      message: "Villages fetched successfully",
      villages,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching villages", error: err });
  }
};
exports.getAllVillagesWithHouses = async (req, res) => {
  try {
    const villages = await Village.findAll({
      include: [
        {
          model: House,
          as: "Houses", // must match the alias used in associations
        },
      ],
    });

    res.status(200).json({
      message: "Villages with houses fetched successfully",
      villages,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });
  }
};

exports.updateVillage = async (req, res) => {
  try {
    const villageId = req.params.id;
    const { name, pin, description } = req.body;

    const village = await Village.findByPk(villageId);
    if (!village) return res.status(404).json({ message: "Village not found" });

    village.name = name || village.name;
    village.pin = pin || village.pin;
    village.description = description || village.description;

    await village.save();
    res.status(200).json({ message: "Village updated successfully", village });
  } catch (err) {
    console.error("Error updating village:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
