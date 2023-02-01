import Url from "../models/urlModel.js";
import { generateShortUrl, validateCustomURL } from "../utils/helper.js";
import { updateRedirect } from "../utils/updateInsights.js";
import { redisClient } from "./../server.js";

const redirectUrl = async (req, res, next) => {
  const url = req.params.url;

  if (!url) return res.status(403).json({ err: "Invalid Request ! " });

  let longUrl = await redisClient.get(url);

  if (longUrl) {
    updateRedirect(url, req);
    return res.redirect(longUrl);
  } else {
    const originalurl = await Url.findOne({ shortURL: url });
    if (!originalurl) return res.status(404).json({ err: "Short URL not found !" });

    updateRedirect(url, req);
    redisClient.set(url, originalurl.originalURL);
    return res.redirect(originalurl.originalURL);
  }
};

const generateRandom = async (req, res, next) => {
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
};

const generateCustom = async (req, res, next) => {
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
};

export { redirectUrl, generateRandom, generateCustom };
