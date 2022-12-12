import admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

import config from "../../config";
import logger from "../../logger";
import { comparePhoneNumber } from "../../utils/phone-number";

const serviceAccount = require("../../../" + config.firebase_cert);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export async function getPhoneNumber(
  token: string
): Promise<string | undefined> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.phone_number;
  } catch (err) {
    logger.error("getPhoneNumber: " + err);
    return undefined;
  }
}

export async function verifyFirebaseToken(
  token: string,
  phoneNumber: string
): Promise<boolean> {
  const firebasePhoneNumber = await getPhoneNumber(token);
  if (!firebasePhoneNumber) {
    return false;
  }

  return comparePhoneNumber(firebasePhoneNumber, phoneNumber);
}
// /**
//  *
//  * @param {string} path
//  * @param {string | Buffer} file
//  */
// export function uploadFile(path: string, file: string | Buffer) {
//   return bucket.file(path).save(file);
// }

// /**
//  *
//  * @param {string} path
//  */
// export function downloadFile(path: string) {
//   return bucket.file(path).download();
// }

export async function sendNotification(tokens: string | string[], data: any) {
  if (!tokens || (Array.isArray(tokens) && tokens.length === 0)) {
    return;
  }

  try {
    await admin.messaging().sendToDevice(tokens, data);
  } catch (err) {
    logger.error("sendNotification: " + err);
    throw err;
  }
}

export async function sendBatchNotification(messages: Message[]) {
  try {
    await admin.messaging().sendAll(messages);
  } catch (err) {
    logger.error("sendNotification: " + err);
    throw err;
  }
}
export async function addToTopic(topic: string, tokens: string | string[]) {
  await admin.messaging().subscribeToTopic(tokens, topic);
}

export async function removeFromTopic(
  topic: string,
  tokens: string | string[]
) {
  await admin.messaging().unsubscribeFromTopic(tokens, topic);
}
