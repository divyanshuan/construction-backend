const express = require("express");
const router = express.Router();
const houseController = require("../Controllers/HouseController");

// Authenticated
router.post("/create/:villageId", houseController.createHouse);
router.delete("/delete/:id", houseController.deleteHouse);

// Public / UI
router.get("/village/:villageId", houseController.getHousesByVillage);
router.get("/getall", houseController.getAllHouses);
router.get("/:id", houseController.getHouseById);
// ✅ New route

module.exports = router;
