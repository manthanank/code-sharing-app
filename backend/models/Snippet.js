const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String },
    content: { type: String },
    expiresAt: { type: Date, default: () => Date.now() + 24*60*60*1000 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Snippet", snippetSchema);