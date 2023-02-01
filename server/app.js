import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import responseTime from "response-time";
import { capture, enableViewRouting } from "express-device";
import Redis from "redis";

/**
 * __filename and __dirname
 */

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * Importing routes
 */

import indexRouter from "./src/v1/routes/index.js";
import usersRouter from "./src/v1/routes/users.js";
import urlRouter from "./src/v1/routes/url.js";

/**
 * Initializing our APP
 */

const app = express();

/**
 * Redis Database configuration.
 */

export const redisClient = Redis.createClient();

(async () => {
  await redisClient.connect();
})();

// redisClient.setEx("name", 15, "nischal");

redisClient.on("ready", () => {
  console.log("Connected to Redis Server !");
});

redisClient.on("error", (err) => {
  console.log("Error in the Connection", +err.message);
});

redisClient.on("end", function () {
  console.log("connection closed");
});

/**
 * Setting middlewares for APP
 */

app.use(cors({ origin: "*" }));
app.use(responseTime());
app.use(capture());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "src/v1/public")));

enableViewRouting(app); // express - device

/**
 * Configuring routes for app.
 */

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/uri", urlRouter);

export default app;
