import { Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";

import logger from "../../logger";
import * as auth from "../auth";
import db from "../database";
import text from "../../text";

export async function authMiddleware(
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) {
  // get bearer token from header
  var token = req.headers["authorization"];
  if (!token) {
    logger.error("authMiddleware: no token");
    return res.status(401).send(text.INVALID_TOKEN);
  }

  const userReq = auth.verifyToken(token);
  if (!userReq) {
    logger.error("authMiddleware: invalid token");
    return res.status(401).send(text.INVALID_TOKEN);
  }

  try {
    const user = await db.userInfo(userReq);
    if (!user) {
      logger.error("authMiddleware: user not found");
      return res.status(401).send(text.ACCOUNT_NOT_FOUND);
    }
    // Check session
    if (!user.auth_session || user.auth_session !== userReq.auth_session) {
      logger.error("authMiddleware: invalid session");
      return res.status(401).send(text.INVALID_TOKEN);
    }

    // set user to request
    res.locals.user = user;

    next();
  } catch (err) {
    logger.error("authMiddleware: " + err);
    return res.status(500).send(text.INTERNAL_ERROR);
  }
}

/**
 *
 * @param {number} maxPerMinute
 * @returns
 */
export function publicApiLimiter(maxPerMinute: number = 6) {
  rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: maxPerMinute,
  });
}
