const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
  generateOtpController
} = require("../controllers/userController");

const router = express.Router();

// get all users
router.get("/all-users", getAllUsers);

router.post("/generateOtp", generateOtpController);

// create user register
router.post("/register", registerController);

//login
router.post("/login", loginController);


module.exports = router;
