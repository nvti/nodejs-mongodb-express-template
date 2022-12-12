import { Request, Response, NextFunction, RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate } from "class-validator";

import logger from "../../logger";
import * as auth from "../auth";
import db from "../database";
import text from "../../text";
import { LoginReq } from "../../models/user";
import { validation } from "../../utils/object";

export async function authMiddleware(
  req: Request,
  res: Response,
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
    const user = await db.userInfo(userReq.phone_number);
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

export function publicApiLimiter(maxPerMinute: number = 6): RequestHandler {
  return rateLimit({
    windowMs: 60 * 1000,
    max: maxPerMinute,
  });
}

export function validationMiddleware<T extends object>(
  cls: ClassConstructor<T>
): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    const errors = await validation(cls, req.body);
    // errors is an array of validation errors
    if (errors.length > 0) {
      let errorTexts = Array();
      for (const errorItem of errors) {
        errorTexts = errorTexts.concat(errorItem.constraints);
      }
      logger.error(errorTexts);
      res.status(400).send(errorTexts);
      return;
    } else {
      next();
    }
  };
}
