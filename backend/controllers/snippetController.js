const Snippet = require("../models/Snippet");

exports.addUpdateSnippet = async (req, res, io) => {
  try {
    const { _id, title = '', content = ''} = req.body;

    let snippet = await Snippet.findById(_id);

    if (snippet) {
      snippet.set({ title, content, updatedAt: Date.now() });
    } else {
      snippet = new Snippet({
        _id,
        title,
        content,
      });
    }

    await snippet.save();
    io.emit('addUpdateSnippet', snippet);
    res.status(201).json(snippet);
  } catch (error) {
    console.error('Error creating or updating snippet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
