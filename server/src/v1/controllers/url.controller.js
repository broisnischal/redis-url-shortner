import asyncHandler from "express-async-handler";
import { generateShortUrlString, generateUniqueString, validateCustomURL, validateUrl } from "./../utils/function.js";
import Url from "../models/url.model.js";

export const info = asyncHandler(async (req, res, next) => {
  res.send("V1 of Snevt url shortner");
});

export const redirect = asyncHandler(async (req, res, next) => {
  const { shortkey } = req.params;
  console.log(shortkey);
});

export const createRandomShortUrl = asyncHandler(async (req, res, next) => {
  const { originalurl } = req.body;

  if (!originalurl) return res.status(400).json({ message: "Please submit Original URL" });

  if (!validateUrl(originalurl)) return res.status(400).json({ message: "Please submit valid URL" });

  const shortkey = generateUniqueString(5);

  const newUrl = await Url.create({
    originalurl,
    shortKey: shortkey,
  });

  return res.status(200).json(newUrl);
});

export const createCustomShortUrl = asyncHandler(async (req, res, next) => {
  const { originalurl, customshorturl } = req.body;

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

  return res.status(200).json(newUrl);
});
