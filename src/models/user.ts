import { IsString, MaxLength, MinLength } from "class-validator";

export enum status {
  NO_PROFILE = "no_profile",
  PENDING = "pending",
  ACTIVATED = "activated",
}

export enum type {
  ADMIN = "admin-1",
  DRIVER = "driver",
}

export enum sex {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface PublicUserInfo {
  phone_number: string;
  name: string;
  avatar?: string;
}

export interface Password {
  hash: string;
  salt: string;
  iterations: number;
}

export interface UserInfo extends PublicUserInfo {
  type: type;
  status: status;
  last_login: Date;
  join_date: Date;
}
export interface User extends UserInfo {
  _id: string;
  password: Password;
  auth_session?: string;
  noti_token?: string;
}

export interface CreateUserReq {
  phone_number: string;
  password: string;
  name: string;
  token: string;
}

export class LoginReq {
  @IsString()
  @MinLength(10)
  @MaxLength(12)
  phone_number: string;

  @IsString()
  password: string;
}

export interface GetUserReq {
  phone_number: string;
}

export interface DeleteUserReq {
  password: string;
}

export interface ForgotPasswordReq {
  phone_number: string;
  token: string;
  password: string;
}

export interface ChangePasswordReq {
  old_password: string;
  new_password: string;
}

export interface SetNotiTokenReq {
  token: string;
}

export interface SetUserTypeReq {
  type: type;
}

export interface SetUserStatusReq {
  status: status;
}

export interface SetUserNameReq {
  name: string;
}

export interface SetUserAvatarReq {
  avatar: string;
}
