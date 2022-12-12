import express from "express";
import { authMiddleware, publicApiLimiter, validation } from "../middleware";
import * as userUseCase from "../../../business/user";
import { catchError } from "../error";
import {
  CreateUserReq,
  ForgotPasswordReq,
  LoginReq,
  User,
} from "../../../models/user";
import logger from "../../../logger";

export function createPublicRoute(): express.Router {
  let route = express.Router();

  // Login
  route.post(
    "/login",
    publicApiLimiter(),
    validation<LoginReq>(),
    async (req, res) => {
      try {
        let user: LoginReq = req.body;
        const token = await userUseCase.login(user);
        res.status(200).json({
          token: token,
        });
      } catch (error) {
        catchError(req, res, error);
      }
    }
  );

  // Register
  route.post("/register", publicApiLimiter(), async (req, res) => {
    try {
      let user: CreateUserReq = req.body;
      const token = await userUseCase.createUser(user);
      res.status(200).json({
        token: token,
      });
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Logout
  route.post("/logout", authMiddleware, async (req, res) => {
    const user: User = res.locals.user;
    try {
      await userUseCase.logout(user.phone_number);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Forgot password
  route.post("/forgot", publicApiLimiter(), async (req, res) => {
    try {
      let data: ForgotPasswordReq = req.body;
      await userUseCase.forgotPassword(data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Check account exist
  route.get("/exist/:phoneNumber", publicApiLimiter(), async (req, res) => {
    const phoneNumber = req.params.phoneNumber;

    try {
      const existed = await userUseCase.userExisted(phoneNumber);
      logger.info(`User ${phoneNumber} exist: ${existed}`);

      if (existed) {
        res.status(200).json({
          code: 0,
          message: "Phone number is already used",
        });
      } else {
        res.status(200).json({
          code: 1,
          message: "Phone number can be used for register",
        });
      }
    } catch (error) {
      catchError(req, res, error);
    }
  });

  return route;
}
