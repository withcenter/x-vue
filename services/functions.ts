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

export function extractRootDomain(hostname: string): string {
  if (hostname.split(".").length === 1) return hostname;
  else {
    const arr = hostname.split(".");
    return arr[1] + "." + arr[2];
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
export function dateRange(d1: Date, d2: Date): number {
  const date1utc = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2utc = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return (date2utc - date1utc) / (1000 * 60 * 60 * 24) + 1;
}
