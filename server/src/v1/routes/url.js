import { Router } from "express";
import { createCustomShortUrl, createRandomShortUrl, redirect, info } from "./../controllers/url.controller.js";

const urlRouter = Router();

urlRouter.route("/").get(info);
urlRouter.route("/:shortkey").get(redirect);
urlRouter.route("/").post(createRandomShortUrl);
urlRouter.post("/custom", createCustomShortUrl);

export default urlRouter;
