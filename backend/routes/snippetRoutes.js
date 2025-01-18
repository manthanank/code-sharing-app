const express = require("express");
const {
  addUpdateSnippet
} = require("../controllers/snippetController");
const router = express.Router();

const useSocket = (handler) => (req, res) => handler(req, res, req.app.get('io'));

router.put("/", useSocket(addUpdateSnippet));

module.exports = router;
