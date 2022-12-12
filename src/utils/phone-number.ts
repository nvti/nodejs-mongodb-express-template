/**
 *
 * @param {string} phoneNumber
 * @returns {boolean}
 */
export function validatePhoneNumber(phoneNumber: string) {
  return /^\d+$/.test(phoneNumber);
}

/**
 *
 * @param {string} phoneNumber
 * @returns {string}
 */
const clearPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) {
    return "";
  }

  if (phoneNumber.startsWith("+84")) {
    phoneNumber = phoneNumber.substring(3);
  }

  phoneNumber = phoneNumber.replace("-", "");
  phoneNumber = phoneNumber.replace(" ", "");
  phoneNumber = phoneNumber.replace("(", "");
  phoneNumber = phoneNumber.replace(")", "");

  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.substring(1);
  }

  return phoneNumber;
};

/**
 *
 * @param {string} phoneNumber1
 * @param {string} phoneNumber2
 * @returns {boolean}
 */
export function comparePhoneNumber(
  phoneNumber1: string,
  phoneNumber2: string
): boolean {
  return clearPhoneNumber(phoneNumber1) === clearPhoneNumber(phoneNumber2);
}
