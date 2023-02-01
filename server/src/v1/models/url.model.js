import mongoose, { Schema } from "mongoose";
import Stats from "./stats.model.js";

const urlSchema = new Schema(
  {
    originalurl: {
      type: String,
      required: true,
    },
    shortKey: {
      type: String,
      required: true,
    },
    redirects: {
      type: Number,
      default: 0,
    },
    stats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stats",
      },
    ],
  },
  {
    timestamps: true,
  }
);

urlSchema.pre("save", async function (next) {
  this.model("Url")
    .findOneAndDelete({ originalurl: this.originalurl, shortKey: this.shortKey })
    .exec((err, doc) => {
      if (err) return next(err);
      next();
    });
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
