const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const useSocket = (handler) => (req, res) =>
  handler(req, res, req.app.get("io"));

// Authentication Routes
router.post("/register", useSocket(register));
router.post("/login", useSocket(login));
router.post("/forgot-password", useSocket(forgotPassword));
router.put("/reset-password/:token/:email", useSocket(resetPassword));
router.get("/me", verifyToken, useSocket(getCurrentUser));

module.exports = router;
