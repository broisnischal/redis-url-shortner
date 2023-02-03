import asyncHandler from "express-async-handler";
import { generateUniqueString, validateCustomURL, validateUrl } from "./../utils/function.js";
import Url from "../models/url.model.js";
import { redisClient } from "./../../../app.js";

const EXPI = process.env.REDIS_EXPIRATION || 1000;

export const info = asyncHandler(async (req, res, next) => {
  res.send("V1 of Snevt url shortner");
});

export const redirect = asyncHandler(async (req, res, next) => {
  const shortKey = req.params.shortKey;

  const data = await redisClient.get(shortKey);

  if (data) {
    return res.json(data);
  } else {
    if (!shortKey) return res.status(400).json({ message: "Please pass valid request" });
    const uri = await Url.findOne({ shortKey });

    if (!uri) return res.status(404).json({ message: "No such Redirection found on server" });
    await redisClient.setEx(shortKey, EXPI, uri.originalurl);
    return res.json(uri);
  }
});

export const createRandomShortUrl = asyncHandler(async (req, res, next) => {
  const { originalurl } = req.body;

  if (!originalurl) return res.status(400).json({ message: "Please enter Original ( Long ) URL 😉" });
  if (!validateUrl(originalurl)) return res.status(400).json({ message: "Please submit valid URL 😞" });

  const data = await redisClient.get(originalurl);

  if (data) {
    return res.status(200).json({ shortKey: data });
  } else {
    const shortkey = generateUniqueString(5);
    const newUrl = await Url.create({
      originalurl,
      shortKey: shortkey,
    });

    await redisClient.setEx(originalurl, EXPI, shortkey);
    return res.status(200).json(newUrl);
  }
});

export const createCustomShortUrl = asyncHandler(async (req, res, next) => {
  const { originalurl, customshorturl } = req.body;

  const data = await redisClient.get(originalurl);

  if (data) {
    return res.json({ shortKey: data });
  } else {
    if (!originalurl) return res.status(400).json({ message: "Please submit Original URL" });
    if (!customshorturl) return res.status(400).json({ message: "Please submit custom short URL" });

    const isExist = await Url.findOne({ shortKey: customshorturl });

    if (isExist) return res.status(400).json({ message: "Custom Name already Taken." });

    if (!validateUrl(originalurl)) return res.status(400).json({ message: "Please submit valid URL" });

    if (customshorturl.length > 15 || customshorturl.length < 3) return res.status(400).json({ message: "Length must be beetween 3 to 15" });
    if (!validateCustomURL(customshorturl)) return res.status(400).json({ message: "Please submit valid Custom Url Parameter" });

    const newUrl = await Url.create({
      originalurl,
      shortKey: customshorturl,
    });
    await redisClient.setEx(originalurl, EXPI, customshorturl);
    return res.status(200).json(newUrl);
  }
});
