import { Request, Response } from "express";

import logger from "../../logger";
import text from "../../text";

// Define a error type
export class RespError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }

  static catchError(req: Request<any>, res: Response<any>, err: any) {
    if (typeof err === "string") {
      logger.error(`${req.path}: ${err}`);
      res.status(400).send(err);
    } else if (err instanceof RespError) {
      logger.error(`${req.path}: ${err.message}`);
      res.status(err.code).send(err.message);
    } else {
      logger.error(`${req.path}: ${JSON.stringify(err)}`);
      logger.error(err);
      res.status(500).send(text.INTERNAL_ERROR);
    }
  }
}
