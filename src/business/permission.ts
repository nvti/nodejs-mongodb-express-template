import { User } from "../models/user";
import * as userModel from "../models/user";

export function isActivated(user: User | undefined | null): boolean {
  return (
    !!user && (isAdmin(user) || user.status === userModel.status.ACTIVATED)
  );
}

export function isAdmin(user: User | undefined | null): boolean {
  return !!user && [userModel.type.ADMIN].includes(user.type);
}

export function isSuperAdmin(user: User | undefined | null): boolean {
  return !!user && !!user.type && user.type === userModel.type.ADMIN;
}

export function canGetUserInfo(user: User) {
  return [userModel.type.ADMIN].includes(user.type);
}

/**
 *
 * @param {{ type: string; }} user
 * @param {{ type: string; }} userTarget
 * @returns boolean
 */
export function canSetUserType(user: User, userTarget: User) {
  return isSuperAdmin(user) && !isSuperAdmin(userTarget);
}

/**
 *
 * @param {{ type: string; }} user
 * @param {{ type: string; }} userTarget
 * @returns boolean
 */
export function canSetUserStatus(user: User, userTarget: User) {
  return isSuperAdmin(user) && !isSuperAdmin(userTarget);
}

/**
 *
 * @param {{ type: string; }} user
 * @returns boolean
 */
export function canGetAdmins(user: User) {
  return isSuperAdmin(user);
}

/**
 *
 * @param {{type: string}} user
 * @returns boolean
 */
export function canListUserByStatus(user: User) {
  return [userModel.type.ADMIN].includes(user.type);
}
