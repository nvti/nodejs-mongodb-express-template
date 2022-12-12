import mongoose from "mongoose";
import logger from "../../../logger";
const Schema = mongoose.Schema;

import * as userModel from "../../../models/user";

const User = mongoose.model(
  "User",
  new Schema<userModel.User>({
    _id: String,
    phone_number: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: {
        hash: {
          type: String,
          required: true,
        },
        salt: {
          type: String,
          required: true,
        },
        iterations: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    auth_session: String,
    noti_token: String,
    last_login: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: String,
    type: {
      type: String,
      required: true,
      enum: Object.values(userModel.type),
    },
  })
);

export async function userExisted(phone_number: string): Promise<boolean> {
  const data = await userInfo(phone_number);
  if (data) {
    return true;
  }

  return false;
}

export async function userInfo(
  phone_number: string
): Promise<userModel.User | null | undefined> {
  return await User.findOne({ phone_number: phone_number });
}

export async function publicUserInfo(
  phone_number: string
): Promise<userModel.PublicUserInfo | null | undefined> {
  return await User.findOne({ phone_number: phone_number }).select({
    name: 1,
    phone_number: 1,
    avatar: 1,
    join_date: 1,
    status: 1,
  });
}

export async function createUser(user: {
  phone_number: string;
  name: string;
  password: userModel.Password;
  auth_session: string;
}): Promise<void> {
  await User.create({
    _id: user.phone_number,
    name: user.name,
    phone_number: user.phone_number,
    password: user.password,
    join_date: new Date(),
    type: userModel.type.DRIVER,
    auth_session: user.auth_session,
    status: userModel.status.NO_PROFILE,
    socket: "",
  });
}

export async function updateUserSession(
  phone_number: string,
  auth_session: string,
  noti_token: string | undefined = undefined
) {
  let updateData: {
    auth_session: string;
    last_login: Date | undefined;
    noti_token: string | undefined;
  } = {
    auth_session: auth_session,
    last_login: undefined,
    noti_token: undefined,
  };
  if (auth_session != "") {
    updateData.last_login = new Date();
  }
  if (noti_token) {
    updateData.noti_token = noti_token;
  }

  await User.findByIdAndUpdate(phone_number, updateData);
}

export async function changePassword(
  phone_number: string,
  password: userModel.Password
) {
  await User.findByIdAndUpdate(phone_number, {
    password: password,
  });
}

export async function deleteUser(phone_number: string) {
  await User.findByIdAndDelete(phone_number);
}

export async function updateNotiToken(
  user: userModel.User,
  token: string | undefined = undefined
) {
  await User.findByIdAndUpdate(user.phone_number, { noti_token: token });
}

export async function setUserType(user: userModel.User, type: userModel.type) {
  await User.findByIdAndUpdate(user.phone_number, { type: type });
}

export async function setUserStatus(
  user: userModel.User,
  status: userModel.status
) {
  await User.findByIdAndUpdate(user.phone_number, { status: status });
}

export async function updateUserName(user: userModel.User, name: string) {
  await User.findByIdAndUpdate(user.phone_number, {
    name: name,
  });
}

export async function updateUserAvatar(user: userModel.User, avatar: string) {
  await User.findByIdAndUpdate(user.phone_number, {
    avatar: avatar,
  });
}
