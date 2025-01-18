const Snippet = require("../models/Snippet");
const cron = require("node-cron");

exports.getSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    res.status(200).json(snippet);
  } catch (error) {
    console.error('Error getting snippet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addUpdateSnippet = async (req, res, io) => {
  try {
    const { _id, title = '', content = ''} = req.body;

    let snippet = await Snippet.findById(_id);

    if (snippet) {
      snippet.set({ title, content, updatedAt: Date.now(), expiresAt: Date.now() + 24*60*60*1000 });
    } else {
      snippet = new Snippet({
        _id,
        title,
        content,
        expiresAt: Date.now() + 24*60*60*1000
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

exports.deleteSnippet = async (req, res, io) => {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id);
    io.emit('deleteSnippet', snippet);
    res.status(204).json();
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

cron.schedule("0 0 * * *", async () => {
  try {
    const snippets = await Snippet.find({ expiresAt: { $lt: Date.now() } });
    snippets.forEach(async (snippet) => {
      await snippet.remove();
    });
  } catch (error) {
    console.error('Error deleting expired snippets:', error);
  }
});