// export function t(code: string) {
//   console.log(app.translation.texts.login);
//   console.log(app.userLanguage);
//   if (!code) return "";
//   if (!app.translation.texts[code]) return code;
//   return app.translation.texts[code][app.userLanguage];
// }

import { ApiService } from "./api.service";
import apiStore from "./api.store";

export function tr(code: string): string {
  if (!code) return "";
  if (!apiStore.texts) return code;
  if (!apiStore.texts[code]) return code;
  if (!apiStore.texts[code][ApiService.instance.userLanguage]) return code;
  return apiStore.texts[code][ApiService.instance.userLanguage];
}

/**
 * Returns root domain(top level domain) from the domain that may have subdomain.
 *
 * @attention it only support domains that has single country code like .com, .net, .kr
 *  It does not support double country code like ".co.kr"
 *
 * @param hostname hostname or domain
 * @returns root domain
 *
 * @example
 *  domain.com => domain.com
 *  abc.domain.com => domain.com
 */
export function getRootDomain(hostname: string): string {
  if (hostname.split(".").length === 1) return hostname;
  else {
    const arr = hostname.split(".");
    const country = arr.pop();
    const company = arr.pop();
    return company + "." + country;
  }
}

export function addByComma(orgValue: string, newValue: string): string {
  const arr = orgValue.split(",");
  if (arr.indexOf(newValue) >= 0) return orgValue; // already exists.
  arr.push(newValue);
  return arr
    .filter((v) => {
      return !!v;
    })
    .join(",");
}

export function deleteByComma(orgValue: string, val: string): string {
  const arr = orgValue.split(",");
  const i = arr.indexOf(val); // fix, since `num` is not same as `string` it will return `-1`.
  if (i >= 0) {
    arr.splice(i, 1);
  }
  return arr
    .filter((v) => {
      return !!v;
    })
    .join(",");
}

/**
 *
 * @param d1 Date - Begin date
 * @param d2 Date - End date
 * @returns number - number of days starting `d1` to `d2`
 * @attention It counts the Begin date to the total range of days.
 * for instance, if we put 2021-11-10 as Begin date and 2021-11-13, it will return 4.
 */
export function daysBetween(date1: string, date2: string): number {
  if (!date1 || !date2) return 0;
  const d1 = new Date(date1).getTime() / 1000;
  const d2 = new Date(date2).getTime() / 1000;
  return Math.ceil((d2 - d1) / (60 * 60 * 24)) + 1;
}

/**
 * Return true if the date is future. If the date is today, it returns false.
 * @param date date - YYYY-MM-DD
 */
export function isFuture(date: string): boolean {
  if (!date) return false;
  const d = new Date(date);
  const n = new Date();

  // if the date is today, return false.
  if (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  ) {
    return false;
  }
  // if the date is past, return false.
  if (d.getTime() < n.getTime()) return false;

  return true;
}

export function getStringDate(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    .toISOString()
    .split("T")[0];
}
