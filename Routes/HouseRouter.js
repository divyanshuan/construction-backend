const express = require("express");
const router = express.Router();
const houseController = require("../Controllers/HouseController");

// Authenticated routes
router.post("/create/:villageId", houseController.createHouse);
router.delete("/delete/:id", houseController.deleteHouse);

// Public or optionally authenticated
router.get("/village/:villageId", houseController.getHousesByVillage);

module.exports = router;
