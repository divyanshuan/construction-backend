const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");
const fileController = require("../Controllers/FileController");

router.post(
  "/village/:village_id/upload",
  upload.array("files", 10),
  fileController.uploadVillageFile
);

router.post(
  "/house/:house_id/upload",
  upload.array("files", 10),
  fileController.uploadHouseFile
);

router.get("/village/:village_id", fileController.getFilesByVillage);
router.get("/house/:house_id", fileController.getFilesByHouse);
router.get("/all", fileController.getAllFiles); // You already added this
router.delete("/:id", fileController.deleteFile);

module.exports = router;
