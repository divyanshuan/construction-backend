const fs = require("fs");
const path = require("path");
const MediaFile = require("../Models/mediafile.model");
const { verifyToken } = require("../utils/AuthJWT");

exports.uploadVillageFile = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  try {
    const files = req.files.map((file) => ({
      file_path: file.path,
      file_type: file.mimetype,
      village_id: req.params.village_id,
    }));

    const result = await MediaFile.bulkCreate(files);
    res.status(200).json({ message: "Files uploaded", files: result });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err });
  }
};

exports.uploadHouseFile = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  try {
    const files = req.files.map((file) => ({
      file_path: file.path,
      file_type: file.mimetype,
      house_id: req.params.house_id,
    }));

    const result = await MediaFile.bulkCreate(files);
    res.status(200).json({ message: "Files uploaded", files: result });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err });
  }
};

exports.getFilesByVillage = async (req, res) => {
  try {
    const files = await MediaFile.findAll({
      where: { village_id: req.params.village_id },
    });
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ message: "Error fetching files", error: err });
  }
};

exports.getFilesByHouse = async (req, res) => {
  try {
    const files = await MediaFile.findAll({
      where: { house_id: req.params.house_id },
    });
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ message: "Error fetching files", error: err });
  }
};

exports.deleteFile = async (req, res) => {
  const token = req.cookies.token;
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  try {
    const file = await MediaFile.findByPk(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.resolve(file.file_path);

    // Delete physical file (with error suppression)
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn("File might already be missing on disk:", e.message);
    }

    await file.destroy();
    res.status(200).json({ message: "File deleted from DB and disk" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
};
exports.getAllFiles = async (req, res) => {
  try {
    const files = await MediaFile.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ message: "All files fetched", files });
  } catch (err) {
    res.status(500).json({ message: "Error fetching files", error: err });
  }
};
