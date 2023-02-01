#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app.js";
import http from "node:http";
import "dotenv/config";
import address from "address";
import mongoose from "mongoose";

// const debug = require("debug")("server:server");

import debug from "debug";
// const log = debug("server:server");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 * Connect to database and start server
 */
mongoose.set("strictQuery", true);
await mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
    console.log(`DB connected to ${process.env.MONGOURI}`);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug.log(`Server listening on ${address.ip()}:${port}`);
}
