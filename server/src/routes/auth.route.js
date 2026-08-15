const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const {
  handleRegister,
  handleLogin,
  handleLogout,
  getMe,
} = require("../controllers/auth.controller");

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

router.get("/me", verifyToken, getMe);

module.exports = router;
