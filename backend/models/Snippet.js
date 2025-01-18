const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Snippet", snippetSchema);
