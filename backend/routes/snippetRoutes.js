const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getSnippets,
  createSnippet,
  updateSnippet,
  getSnippet,
  deleteSnippet
} = require("../controllers/snippetController");
const router = express.Router();

const useSocket = (handler) => (req, res) => handler(req, res, req.app.get('io'));

router.get("/", useSocket(getSnippets));
router.post("/", verifyToken, useSocket(createSnippet));
router.get("/:id", useSocket(getSnippet));
router.put("/:id", verifyToken, useSocket(updateSnippet));
router.delete("/:id", verifyToken, useSocket(deleteSnippet));

module.exports = router;
