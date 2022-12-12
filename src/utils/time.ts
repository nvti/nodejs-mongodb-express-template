import moment from "moment-timezone";

const timezone = "Asia/Ho_Chi_Minh";

/**
 * @param {string | number | Date} date
 */
export function fDate(date: string | number | Date) {
  return moment(new Date(date)).format("dd/MM/yyyy");
}

/**
 * @param {string | number | Date} date
 */
export function fDateDash(date: string | number | Date) {
  return moment(new Date(date)).format("dd-MM-yyyy");
}

/**
 * @param {string | number | Date} date
 */
export function fDateTime(date: string | number | Date) {
  return moment(new Date(date)).format("HH:mm dd/MM/yyyy");
}

/**
 * @param {string | number | Date} date
 */
export function fDateTimezone(date: string | number | Date) {
  return moment(new Date(date)).tz(timezone).format("dd/MM/yyyy");
}

/**
 * @param {string | number | Date} date
 */
export function fDateTimeTimezone(date: string | number | Date) {
  return moment(new Date(date)).tz(timezone).format("HH:mm dd/MM/yyyy");
}
