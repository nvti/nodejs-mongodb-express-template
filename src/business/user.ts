import db from "../services/database";
import * as auth from "../services/auth";
import { validatePhoneNumber } from "../utils/phone-number";
import { RestError } from "../utils/error";
import text from "../text";
import logger from "../logger";
import * as permission from "./permission";
import * as userModel from "../models/user";
import { verifyFirebaseToken } from "../services/firebase";
import { validateEnumAndThrow, validateFieldsAndThrow } from "../utils/object";

export async function userExisted(phone_number: string) {
  return await db.userExisted(phone_number);
}

export async function createUser(user: userModel.CreateUserReq) {
  validateFieldsAndThrow(user, ["name", "phone_number", "password", "token"]);

  // verify phone number by firebase
  if (!(await verifyFirebaseToken(user.token, user.phone_number))) {
    throw new RestError(`${text.INVALID_TOKEN}`, 403);
  }

  // Validate phone number
  if (!validatePhoneNumber(user.phone_number)) {
    throw new RestError(`${text.INVALID_PHONE_NUMBER}`, 400);
  }

  // Check phone number
  if (await db.userExisted(user.phone_number)) {
    throw new RestError(`${text.PHONE_NUMBER_EXISTS}`, 400);
  }

  // Create hashed password
  const password = auth.hashPassword(user.password);
  // generate token
  const token = auth.generateToken(user);

  // Save user information
  await db.createUser({
    name: user.name,
    phone_number: user.phone_number,
    password: password,
    auth_session: token,
  });

  return token;
}

/**
 *
 * @param {{ password: string; phone_number: string; }} data
 * @returns
 */
export async function login(data: userModel.LoginReq) {
  validateFieldsAndThrow(data, ["phone_number", "password"]);

  // Get user information
  const user = await db.userInfo(data.phone_number);
  if (!user) {
    throw new RestError(`${text.ACCOUNT_NOT_FOUND}`, 404);
  }

  // Verify password
  if (!auth.verifyPassword(user, data.password)) {
    throw new RestError(`${text.WRONG_PASSWORD}`, 403);
  }

  // generate token
  const token = auth.generateToken(user);

  // Update user session
  await db.updateUserSession(user.phone_number, token);

  return token;
}

export async function getUserInfo(targetUser: userModel.GetUserReq) {
  return await db.userInfo(targetUser.phone_number);
}

export async function getPublicUserInfo(
  user: userModel.User,
  targetUser: userModel.GetUserReq
) {
  let info;
  if (permission.canGetUserInfo(user)) {
    info = await db.userInfo(targetUser.phone_number);
    if (info) {
      // @ts-ignore
      info.password = undefined;
      info.auth_session = undefined;
      info.noti_token = undefined;
    }
  } else {
    // @ts-ignore
    info = await db.publicUserInfo(targetUser.phone_number);
  }

  if (!info) {
    throw new RestError(`${text.ACCOUNT_NOT_FOUND}`, 404);
  }
  return info;
}
export async function logout(phone_number: string) {
  await db.updateUserSession(phone_number, "", "");
}

export async function deleteUser(
  user: userModel.User,
  data: userModel.DeleteUserReq
) {
  // Verify password
  if (!auth.verifyPassword(user, data.password)) {
    throw new RestError(`${text.WRONG_PASSWORD}`, 403);
  }

  await db.deleteUser(user.phone_number);
}

export async function forgotPassword(data: userModel.ForgotPasswordReq) {
  validateFieldsAndThrow(data, ["phone_number", "password", "token"]);

  // verify phone number by firebase
  if (!(await verifyFirebaseToken(data.token, data.phone_number))) {
    throw new RestError(`${text.INVALID_TOKEN}`, 403);
  }

  // Create hashed password
  const password = auth.hashPassword(data.password);

  // Update user password
  await db.changePassword(data.phone_number, password);
}

export async function changePassword(
  user: userModel.User,
  data: userModel.ChangePasswordReq
) {
  validateFieldsAndThrow(data, ["old_password", "new_password"]);

  if (data.old_password === data.new_password) {
    throw new RestError(`${text.NEW_PASSWORD_MUST_DIFFERENT}`, 400);
  }

  // verify old password
  if (!auth.verifyPassword(user, data.old_password)) {
    throw new RestError(`${text.WRONG_PASSWORD}`, 403);
  }

  // Create hashed password
  const password = auth.hashPassword(data.new_password);

  // Update user password
  await db.changePassword(user.phone_number, password);
}

export async function updateNotiToken(
  user: userModel.User,
  data: userModel.SetNotiTokenReq
) {
  validateFieldsAndThrow(data, ["token"]);

  await db.updateNotiToken(user, data.token);
}

export async function deleteNotiToken(user: userModel.User) {
  await db.updateNotiToken(user);
}

export async function setUserType(
  user: userModel.User,
  phone_number: string,
  data: userModel.SetUserTypeReq
) {
  validateFieldsAndThrow(data, ["type"]);
  validateEnumAndThrow("type", data.type, userModel.type);

  const userTarget = await db.userInfo(phone_number);
  if (!userTarget) {
    throw new RestError(`${text.ACCOUNT_NOT_FOUND}`, 404);
  }
  if (!permission.canSetUserType(user, userTarget)) {
    throw new RestError(`${text.PERMISSION_DENIED}`, 403);
  }

  const oldType = userTarget.type;
  await db.setUserType(user, data.type);

  // notification.updateUserType(user, userTarget, oldType, data.type);
}

export async function setUserStatus(
  user: userModel.User,
  phone_number: string,
  data: userModel.SetUserStatusReq
) {
  validateFieldsAndThrow(data, ["status"]);
  validateEnumAndThrow("status", data.status, userModel.status);

  const userTarget = await db.userInfo(phone_number);
  if (!userTarget) {
    throw new RestError(`${text.ACCOUNT_NOT_FOUND}`, 404);
  }

  if (!permission.canSetUserStatus(user, userTarget)) {
    throw new RestError(`${text.PERMISSION_DENIED}`, 403);
  }

  await db.setUserStatus(user, data.status);
}

export async function updateUserName(
  user: userModel.User,
  data: userModel.SetUserNameReq
) {
  validateFieldsAndThrow(data, ["name"]);

  await db.updateUserName(user, data.name);
}

export async function updateUserAvatar(
  user: userModel.User,
  data: userModel.SetUserAvatarReq
) {
  validateFieldsAndThrow(data, ["avatar"]);

  await db.updateUserAvatar(user, data.avatar);
}
