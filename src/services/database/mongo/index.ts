import mongoose from "mongoose";
import bluebird from "bluebird";
mongoose.Promise = bluebird;

import config from "../../../config";
import logger from "../../../logger";

const connect = mongoose.connect(config.db.url);

mongoose.connection.on("connected", () => {
  logger.info("Mongo has connected successfully");
});
mongoose.connection.on("reconnected", () => {
  logger.info("Mongo has reconnected");
});
mongoose.connection.on("error", (error) => {
  logger.info("Mongo connection has an error", error);
  mongoose.disconnect();
});
mongoose.connection.on("disconnected", () => {
  logger.info("Mongo connection is disconnected");
});
