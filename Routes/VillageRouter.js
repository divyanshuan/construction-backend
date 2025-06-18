const express = require("express");
const router = express.Router();
const villageController = require("../Controllers/VillageController");

router.post("/create", villageController.createVillage);
router.put("/:id", villageController.updateVillage);
router.get("/getall", villageController.getAllVillages);
router.get("/getallwithhouse", villageController.getAllVillagesWithHouses);
router.delete("/:id", villageController.deleteVillage);

module.exports = router;
