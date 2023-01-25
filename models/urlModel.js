const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema(
  {
    originalURL: {
      type: String,
      required: true,
    },
    shortURL: {
      type: String,
      required: true,
      unique: true,
    },
    mobileType: {
      type: Number,
      default: 0,
    },
    desktopType: {
      type: Number,
      default: 0,
    },
    redirect: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", URLSchema);
