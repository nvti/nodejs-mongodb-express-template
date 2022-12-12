export function validatePhoneNumber(phoneNumber: string): boolean {
  return /^\d{10,12}$/.test(clearPhoneNumber(phoneNumber));
}

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

export function comparePhoneNumber(
  phoneNumber1: string,
  phoneNumber2: string
): boolean {
  return clearPhoneNumber(phoneNumber1) === clearPhoneNumber(phoneNumber2);
}
