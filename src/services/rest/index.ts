import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http, { Server } from "http";

import logger from "../../logger";
import { restLogger } from "./logger";
import { authMiddleware, publicApiLimiter } from "./middleware";
import { createUserRoute } from "./route/user";
import { createPublicRoute } from "./route/public";

export class WebServer {
  port: number;
  app: Express;
  server: Server;
  /**
   * @param {number} port
   */
  constructor(port: number) {
    this.port = port;
    this.app = express();

    this.app.use(restLogger);
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "14MB" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.set("query parser", "simple");

    this.setupRoute();

    this.server = http.createServer(this.app);
  }

  run() {
    this.server.listen(this.port, () => {
      logger.info(
        `⚡️[server]: Server is running at http://localhost:${this.port}`
      );
    });
  }

  setupRoute() {
    const publicRoute = createPublicRoute();
    this.app.use("/", publicRoute, (req, res) => {
      res.sendStatus(404);
    });

    // add user route
    const userRoute = createUserRoute();
    this.app.use("/user", userRoute, (req, res) => {
      res.sendStatus(404);
    });
  }
}
