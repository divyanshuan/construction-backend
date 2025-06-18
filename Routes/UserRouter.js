const express = require("express");
const userController = require("../Controllers/UserController");
const router = express.Router();

router.route("/login").post(userController.loginUser);
router.route("/signup").post(userController.registerUser);
router.route("/logout").get(userController.logoutUser);
router.route("/auth").get(userController.authUser);

module.exports = router;
