const Snippet = require("../models/Snippet");

exports.getSnippets = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

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

exports.getSnippet = async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) {
    return res.status(404).json({ message: "Snippet not found" });
  }
  res.json(snippet);
};

exports.updateSnippet = async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) {
    return res.status(404).json({ message: "Snippet not found" });
  }
  if (snippet.author.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You are not allowed to update this snippet" });
  }
  snippet.set(req.body);
  await snippet.save();
  res.json(snippet);
};
