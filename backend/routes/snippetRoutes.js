const express = require("express");
const {
  getSnippet,
  addUpdateSnippet,
  deleteSnippet
} = require("../controllers/snippetController");
const router = express.Router();

const useSocket = (handler) => (req, res) => handler(req, res, req.app.get('io'));

router.get("/:id", useSocket(getSnippet));
router.put("/", useSocket(addUpdateSnippet));
router.delete("/:id", useSocket(deleteSnippet));

module.exports = router;
