import express, { json } from "express";
import { set, connect } from "mongoose";
import { createClient } from "redis";
import { capture, enableViewRouting } from "express-device";
import responseTime from "response-time";
import morgan from "morgan";
import cors from "cors";
import ip from "ip";

import Url from "./models/urlModel.js";
import urlRouter from "./routes/url.route.js";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(responseTime());
app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));
app.use(json());
app.use(capture());

enableViewRouting(app);

const url = process.env.MONGO || "mongodb://127.0.0.1:27017/urls";

export const redisClient = createClient();

// connecting to database

(async () => {
  set("strictQuery", true);

  connect(url, (err, info) => {
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

app.get("/url", urlRouter);

app.get("/", async (req, res, next) => {
  return res.send(` You are from ${req.device.type}`);
});

app.all("*", (req, res, next) => {
  return res.status(404).json({ msg: "Request Not Found | 404 " });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on ${ip.address()}:${PORT} 🚀`);
});
