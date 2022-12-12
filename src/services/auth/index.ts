import crypto from "crypto";
import jwt from "jsonwebtoken";

import config from "../../config";
import logger from "../../logger";
import { Password } from "../../models/user";

/**
 *
 * @param {string} password
 * @returns {{salt: string; hash: string; iterations: number}}
 */
export function hashPassword(password: string): Password {
  const salt = crypto.randomBytes(32).toString("base64");
  const hash = crypto
    .pbkdf2Sync(password, salt, config.auth.hash_iterations, 64, "sha256")
    .toString("base64");

  return {
    salt: salt,
    hash: hash,
    iterations: config.auth.hash_iterations,
  };
}

export function verifyPassword(
  user: { password: Password },
  password: string
): boolean {
  const salt = user.password.salt;
  const hash = crypto
    .pbkdf2Sync(password, salt, user.password.iterations, 64, "sha256")
    .toString("base64");

  return hash === user.password.hash;
}

export function generateToken(user: { phone_number: string }): string {
  return jwt.sign({ phone_number: user.phone_number }, config.auth.jwt_secret, {
    expiresIn: config.auth.jwt_expire_in,
  });
}

export function verifyToken(
  token: string
): { phone_number: string; auth_session: string } | undefined {
  if (!token) {
    return undefined;
  }
  // check if start with Bearer
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwt_secret);
    if (typeof decoded == "string") {
      logger.error("Wrong token data type");
      return undefined;
    }
    return {
      phone_number: decoded.phone_number,
      auth_session: token,
    };
  } catch (err) {
    logger.error("verifyToken: " + err);
    return undefined;
  }
}

export function signURL(url: string): string {
  // TODO: sign url

  return url;
}
