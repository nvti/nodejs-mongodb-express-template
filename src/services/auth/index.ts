import crypto from "crypto";
import jwt from "jsonwebtoken";

import config from "../../config";
import logger from "../../logger";
import { comparePhoneNumber } from "../../utils/phone-number";

/**
 *
 * @param {string} password
 * @returns {{salt: string; hash: string; iterations: number}}
 */
export function hashPassword(password: string): {
  salt: string;
  hash: string;
  iterations: number;
} {
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

/**
 *
 * @param {{ password: { salt: string; iterations: number; hash: string; }; }} user
 * @param {string} password
 * @returns {boolean}
 */
export function verifyPassword(
  user: { password: { salt: string; iterations: number; hash: string } },
  password: string
): boolean {
  const salt = user.password.salt;
  const hash = crypto
    .pbkdf2Sync(password, salt, user.password.iterations, 64, "sha256")
    .toString("base64");

  return hash === user.password.hash;
}

/**
 *
 * @param {{ phone_number: string; }} user
 * @returns {string}
 */
export function generateToken(user: { phone_number: string }): string {
  return jwt.sign({ phone_number: user.phone_number }, config.auth.jwt_secret, {
    expiresIn: config.auth.jwt_expire_in,
  });
}

/**
 *
 * @param {string} token
 * @returns {{phone_number: string; auth_session: string} | undefined}
 */
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

/**
 *
 * @param {string} token
 * @param {string} phoneNumber
 * @returns {Promise<boolean>}
 */
// export async function verifyFirebaseToken(
//   token: string,
//   phoneNumber: string
// ): Promise<boolean> {
//   const firebasePhoneNumber = await getPhoneNumber(token);
//   if (!firebasePhoneNumber) {
//     return false;
//   }

//   return comparePhoneNumber(firebasePhoneNumber, phoneNumber);
// }

/**
 *
 * @param {string} url
 * @returns {string}
 */
export function signURL(url: string): string {
  // TODO: sign url

  return url;
}
