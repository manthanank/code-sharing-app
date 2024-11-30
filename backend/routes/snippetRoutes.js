const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getSnippets, createSnippet } = require("../controllers/snippetController");
const router = express.Router();

// Get paginated snippets
router.get("/", getSnippets);

// Create snippet
router.post("/", verifyToken, createSnippet);

module.exports = router;