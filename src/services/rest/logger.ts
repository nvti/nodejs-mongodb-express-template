import { Request, Response, NextFunction } from "express";
import logger from "../../logger";

/**
 *
 * @param {[number, number]} start
 * @returns {number}
 */
const getActualRequestDurationInMilliseconds = (
  start: [number, number] | undefined
) => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export function restLogger(
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) {
  //middleware function
  let method = req.method;
  let url = req.url;
  const start = process.hrtime();

  res.on("finish", () => {
    let status = res.statusCode;
    const duration = getActualRequestDurationInMilliseconds(start);
    let log = `${method}:${url} ${status} ${duration.toLocaleString()} ms`;
    logger.info(log);
  });

  next();
}
