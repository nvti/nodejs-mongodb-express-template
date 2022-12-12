import {
  IsString,
  IsEnum,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { validatePhoneNumber } from "../utils/phone-number";

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

@ValidatorConstraint({ name: "IsPhoneNumber", async: false })
export class IsPhoneNumber implements ValidatorConstraintInterface {
  validate(phone_number: string, args: ValidationArguments) {
    return validatePhoneNumber(phone_number);
  }

  defaultMessage(args: ValidationArguments) {
    return "Phone number ($value) is not valid!";
  }
}

export class CreateUserReq {
  @Validate(IsPhoneNumber)
  phone_number: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  token: string;
}

export class LoginReq {
  @Validate(IsPhoneNumber)
  phone_number: string;

  @IsString()
  password: string;
}

export class GetUserReq {
  @Validate(IsPhoneNumber)
  phone_number: string;
}

export class DeleteUserReq {
  @IsString()
  password: string;
}

export class ForgotPasswordReq {
  @Validate(IsPhoneNumber)
  phone_number: string;

  @IsString()
  token: string;

  @IsString()
  password: string;
}

export class ChangePasswordReq {
  @IsString()
  old_password: string;

  @IsString()
  new_password: string;
}

export class SetNotiTokenReq {
  @IsString()
  token: string;
}

export class SetUserTypeReq {
  @IsEnum(type)
  type: type;
}

export class SetUserStatusReq {
  @IsEnum(status)
  status: status;
}

export class SetUserNameReq {
  @IsString()
  name: string;
}

export class SetUserAvatarReq {
  @IsString()
  avatar: string;
}
