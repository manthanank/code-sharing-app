const express = require("express");
const {
  getSnippet,
  addUpdateSnippet
} = require("../controllers/snippetController");
const router = express.Router();

const useSocket = (handler) => (req, res) => handler(req, res, req.app.get('io'));

router.get("/:id", useSocket(getSnippet));
router.put("/", useSocket(addUpdateSnippet));

module.exports = router;
