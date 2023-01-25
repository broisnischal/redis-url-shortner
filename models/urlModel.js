const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortURL: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Url", URLSchema);
