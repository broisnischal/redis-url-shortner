const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const generateShortUrl = require("./helper");

const Url = require("./models/urlModel");

const path = require("path");

const app = express();

app.use(express.json());

const url = process.env.MONGO || "mongodb://127.0.0.1:27017/url-shortner";

const redisClient = redis.createClient();

// connecting to database

(async () => {
  mongoose.set("strictQuery", true);

  mongoose.connect(url, (err, info) => {
    if (err) throw err;
    console.log("Mongo Connected !");
  });

  await redisClient.connect();
})();

redisClient.on("ready", () => {
  console.log("Connected to Redis Server !");
});

redisClient.on("error", (err) => {
  console.log("Error in the Connection", +err.message);
});

redisClient.on("end", function () {
  console.log("connection closed");
});

// HOMEPAGE

app.get("/", async (req, res, next) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

// SHORT

app.post("/", async (req, res, next) => {
  const { URL } = req.body;

  if (!URL) return res.stateEus(403).json({ err: "Please submit the valid response ! " });

  let uri = await redisClient.get(URL);

  if (uri) {
    return res.json({ uri });
  } else {
    const shortURL = generateShortUrl(5);

    try {
      const url = await Url.create({ originalURL: URL, shortURL });
      await redisClient.set(URL, shortURL);
      return res.json({ shortURL });
    } catch (error) {
      return res.status(500).json({ error: "Failed to save URL to database" + error });
    }
  }
});

app.get("/:url", async (req, res, next) => {
  const url = req.params.url;

  if (!url) return res.status(403).json({ err: "Invalid Request ! " });

  let longUrl = await redisClient.get(url);

  if (longUrl) {
    return res.redirect(longUrl);
  } else {
    const originalurl = await Url.findOne({ shortURL: url });
    if (!originalurl) return res.status(404).json({ err: "Short URL not found !" });
    redisClient.set(url, originalurl.originalURL);
    return res.redirect(originalurl.originalURL);
  }
});

app.all("*", (req, res, next) => {
  return res.status(404).json({ msg: "Request Not Found | 404 " });
});

app.listen(3000, () => {
  console.log("Server listening on PORT 3000.");
});
