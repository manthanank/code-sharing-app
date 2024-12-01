const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getSnippets,
  createSnippet,
  updateSnippet,
  getSnippet,
} = require("../controllers/snippetController");
const router = express.Router();

router.get("/", getSnippets);
router.post("/", verifyToken, createSnippet);
router.get("/:id", getSnippet);
router.put("/:id", verifyToken, updateSnippet);

module.exports = router;
