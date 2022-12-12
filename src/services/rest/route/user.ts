import express from "express";
import logger from "../../../logger";
import * as userUseCase from "../../../business/user";
import { catchError } from "../error";
import { authMiddleware, publicApiLimiter } from "../middleware";
import {
  ChangePasswordReq,
  DeleteUserReq,
  SetNotiTokenReq,
  SetUserAvatarReq,
  SetUserNameReq,
  SetUserTypeReq,
  User,
  UserInfo,
} from "../../../models/user";

export function createUserRoute(): express.Router {
  // User route
  let userRoute = express.Router();
  userRoute.use(authMiddleware);

  // Change password
  userRoute.post("/password", async (req, res) => {
    const user = res.locals.user;
    // update password
    try {
      const data: ChangePasswordReq = req.body;
      await userUseCase.changePassword(user, data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Get user info
  userRoute.get("/", (req, res) => {
    const user: UserInfo = res.locals.user;
    res.status(200).json(user);
  });

  // delete account
  userRoute.post("/delete", async (req, res) => {
    const user: User = res.locals.user;
    try {
      const data: DeleteUserReq = req.body;
      await userUseCase.deleteUser(user, data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Update new notification token
  userRoute.post("/token", async (req, res) => {
    const user: User = res.locals.user;

    try {
      const data: SetNotiTokenReq = req.body;
      await userUseCase.updateNotiToken(user, data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  userRoute.post("/name", async (req, res) => {
    const user: User = res.locals.user;
    try {
      const data: SetUserNameReq = req.body;
      await userUseCase.updateUserName(user, data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  userRoute.post("/avatar", async (req, res) => {
    const user: User = res.locals.user;
    try {
      const data: SetUserAvatarReq = req.body;
      await userUseCase.updateUserAvatar(user, data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Get public info of an user
  userRoute.get("/:phoneNumber", async (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const user: User = res.locals.user;
    try {
      const publicInfo = await userUseCase.getPublicUserInfo(user, {
        phone_number: phoneNumber,
      });
      if (publicInfo) {
        res.status(200).json(publicInfo);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      catchError(req, res, error);
    }
  });

  // Set type of user
  userRoute.post("/:phoneNumber/type", async (req, res) => {
    const user: User = res.locals.user;
    const phoneNumber = req.params.phoneNumber;
    try {
      const data: SetUserTypeReq = req.body;
      await userUseCase.setUserType(user, phoneNumber, data);
      res.sendStatus(200);
    } catch (error) {
      catchError(req, res, error);
    }
  });

  return userRoute;
}
