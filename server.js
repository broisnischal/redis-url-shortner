const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const { generateShortUrl, validateCustomURL } = require("./helper");
const device = require("express-device");
const responseTime = require("response-time");
const morgan = require("morgan");
const cors = require("cors");
const Url = require("./models/urlModel");
const ip = require("ip");
const path = require("path");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(responseTime());
app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(device.capture());

device.enableViewRouting(app);

const url = process.env.MONGO || "mongodb://127.0.0.1:27017/urls";

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
  // res.sendFile(path.join(__dirname + "/public/index.html"));
  return res.send(req.device.type);
});

app.get("/allurls", async (req, res, next) => {
  const data = await Url.find().sort({ createdAt: -1 }).limit(20);

  return res.json(data);
});

// SHORT

app.post("/", async (req, res, next) => {
  const { URL } = req.body;

  if (!URL) return res.status(403).json({ err: "Please submit the valid response ! " });

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

app.post("/custom", async (req, res, next) => {
  const { URL, customName } = req.body;

  if (!URL) return res.status(403).json({ err: "Please submit original URL ! " });
  if (!customName) return res.status(403).json({ err: "Please submit customName !" });

  if (!validateCustomURL(customName)) return res.status(403).json({ err: "Include only alphanumeric characters!" });
  if (customName.length >= 15) return res.status(403).json({ err: "Character length must be less than 15 characters." });
  if (customName.length <= 3) return res.status(403).json({ err: "Needed more than 3 characters." });

  let uri = await redisClient.get(URL);

  if (uri) {
    return res.json({ uri });
  } else {
    try {
      const alreadyexists = await Url.findOne({ shortURL: customName });

      if (alreadyexists) return res.status(403).json({ err: "Short url parameter already exists." });

      const url = await Url.create({ originalURL: URL, shortURL: customName });
      await redisClient.set(URL, customName);
      const returnurl = req.get("host") + "/" + customName;

      return res.json({ url: returnurl });
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

    await Url.findByIdAndUpdate(originalurl.id, {
      $inc: { redirect: 1 },
    });

    if (req.device.type === "desktop") {
      await Url.findByIdAndUpdate(originalurl.id, {
        $inc: { desktopType: 1 },
      });
    }
    if (req.device.type === "phone") {
      await Url.findByIdAndUpdate(originalurl.id, {
        $inc: { mobileType: 1 },
      });
    }
    redisClient.set(url, originalurl.originalURL);
    return res.redirect(originalurl.originalURL);
  }
});

app.all("*", (req, res, next) => {
  return res.status(404).json({ msg: "Request Not Found | 404 " });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on ${ip.address()}:${PORT} 🚀`);
});
