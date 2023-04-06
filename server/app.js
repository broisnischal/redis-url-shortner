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

import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  // Connect to your internal Redis instance using the REDIS_URL environment variable
  // The REDIS_URL is set to the internal Redis URL e.g. redis://red-343245ndffg023:6379

  redisClient.on("error", (err) => console.log("Redis Client Error", err));

  await redisClient.connect();

  // Send and retrieve some values
  await redisClient.set("key", "node redis");
  const value = await redisClient.get("key");

  console.log("found value: ", value);
})();

// export const redisClient = Redis.createClient({
//   host: "redis://red-cgn4upfdvk4k017tqlq0:6379",
//   // port: process.env.PORT,
//   password: "sfDFus9GPqO6xM4CzRPZhRQSo6K1EiS9",
//   username: "default",
// });

// (async () => {
//   await redisClient.connect();
// })();

// redisClient.on("ready", () => {
//   console.log("Connected to Redis Server !");
// });

// redisClient.on("error", (err) => {
//   console.log(err);
//   console.log("Error in the Connection", +err.message);
// });

// redisClient.on("end", function () {
//   console.log("connection closed");
// });
// redisClient.setEx("name", 15, "nischal");

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
