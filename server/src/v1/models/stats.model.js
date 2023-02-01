import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Url",
  },
  country: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;
