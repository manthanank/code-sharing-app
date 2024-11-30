const Snippet = require("../models/Snippet");

exports.getSnippets = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const snippets = await Snippet.find()
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalSnippets = await Snippet.countDocuments();
  res.json({
    currentPage: parseInt(page),
    totalPages: Math.ceil(totalSnippets / limit),
    snippets,
  });
};

exports.createSnippet = async (req, res) => {
  const snippet = new Snippet({ ...req.body, author: req.user.id });
  await snippet.save();
  res.status(201).json(snippet);
};
