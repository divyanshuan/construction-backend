const fs = require("fs");
const path = require("path");
const Village = require("../Models/village.model");
const House = require("../Models/house.model");
const MediaFile = require("../Models/mediafile.model");
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

exports.getAllVillages = async (req, res) => {
  try {
    const villages = await Village.findAll();
    res
      .status(200)
      .json({ message: "Villages fetched successfully", villages });
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
          as: "Houses",
        },
      ],
    });

    res.status(200).json({ message: "Villages with houses fetched", villages });
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });
  }
};

exports.getVillageById = async (req, res) => {
  const villageId = req.params.id;

  try {
    const village = await Village.findOne({
      where: { village_id: villageId },
      include: [
        { model: House, as: "Houses" },
        { model: MediaFile, as: "MediaFiles" },
      ],
    });

    if (!village) {
      return res.status(404).json({ message: "Village not found" });
    }

    res.status(200).json({ message: "Village fetched successfully", village });
  } catch (err) {
    console.error("Error fetching village:", err);
    res.status(500).json({ message: "Error fetching village", error: err });
  }
};

exports.deleteVillage = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const villageId = req.params.id;

  try {
    // Check village ownership
    const village = await Village.findOne({
      where: {
        village_id: villageId,
        user_id: decoded.user_id,
      },
    });

    if (!village) {
      return res
        .status(404)
        .json({ message: "Village not found or unauthorized" });
    }

    // --- Delete village-level files (DB + disk) ---
    const villageFiles = await MediaFile.findAll({
      where: { village_id: villageId },
    });
    for (const file of villageFiles) {
      const filePath = path.resolve("uploads", path.basename(file.file_path));
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Failed to delete file: ${filePath}`, err.message);
      }
    }
    await MediaFile.destroy({ where: { village_id: villageId } });

    // --- Get all houses under this village ---
    const houses = await House.findAll({ where: { village_id: villageId } });

    for (const house of houses) {
      // Delete house-level files (DB + disk)
      const houseFiles = await MediaFile.findAll({
        where: { house_id: house.house_id },
      });
      for (const file of houseFiles) {
        const filePath = path.resolve("uploads", path.basename(file.file_path));
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn(`Failed to delete house file: ${filePath}`, err.message);
        }
      }
      await MediaFile.destroy({ where: { house_id: house.house_id } });
    }

    // --- Delete houses and village ---
    await House.destroy({ where: { village_id: villageId } });
    await Village.destroy({ where: { village_id: villageId } });

    res.status(200).json({ message: "Village and related data deleted" });
  } catch (err) {
    console.error("Error deleting village:", err);
    res.status(500).json({ message: "Error deleting village", error: err });
  }
};
