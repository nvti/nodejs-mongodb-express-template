import text from "../text";
import { RestError } from "./error";

export function validateFields(
  data: { [x: string]: any },
  fields: string[]
): string[] {
  const failedFields = [];
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    if (data[field] === undefined || data[field] === "") {
      failedFields.push(field);
    }
  }
  return failedFields;
}

export function validateFieldsAndThrow(
  data: { [x: string]: any },
  fields: string[]
) {
  const failedFields = validateFields(data, fields);
  if (failedFields.length > 0) {
    throw new RestError(`${text.MISSING_FIELD}: ${failedFields.join(", ")}`);
  }
}

export function validateEnum(value: any, enumObject: any[] | object): boolean {
  // check if enumObject is an array
  if (Array.isArray(enumObject)) {
    return enumObject.includes(value);
  }
  return Object.values(enumObject).includes(value);
}

export function validateEnumAndThrow(
  field: string,
  value: any,
  enumObject: any[] | object
) {
  if (!validateEnum(value, enumObject)) {
    throw new RestError(
      `${text.INVALID_VALUE} (${field}: ${value}). ${text.VALID_VALUE}: ${
        Array.isArray(enumObject) ? enumObject : Object.values(enumObject)
      }`
    );
  }
}
