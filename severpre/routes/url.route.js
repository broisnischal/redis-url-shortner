import { Router } from "express";

const urlRouter = Router();
import { generateRandom, generateCustom, redirectUrl } from "../controllers/url.controller.js";

urlRouter.get("/", async (req, res, next) => {
  res.send("hello");
});

urlRouter.post("/", generateRandom);

urlRouter.get("/:url", redirectUrl);
urlRouter.post("/custom", generateCustom);

export default urlRouter;
