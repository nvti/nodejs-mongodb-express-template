import { Request, Response } from "express";

import logger from "../../logger";
import text from "../../text";
import { RestError } from "../../utils/error";

export function catchError(req: Request<any>, res: Response<any>, err: any) {
  if (typeof err === "string") {
    logger.error(`${req.path}: ${err}`);
    res.status(400).send(err);
  } else if (err instanceof RestError) {
    logger.error(`${req.path}: ${err.message}`);
    res.status(err.code).send(err.message);
  } else {
    logger.error(`${req.path}: ${JSON.stringify(err)}`);
    logger.error(err);
    res.status(500).send(text.INTERNAL_ERROR);
  }
}
