import dayjs from "dayjs";
import { Dictionary } from "vue-router/types/router";
import { ApiService } from "./api.service";

// /**
//  * @deprecated
//  * @param code
//  * @returns
//  */
// export function tr(code: string): string {
//   if (!code) return "";
//   if (!apiStore.texts) return code;
//   if (!apiStore.texts[code]) return code;
//   if (!apiStore.texts[code][ApiService.instance.userLanguage]) return code;
//   return apiStore.texts[code][ApiService.instance.userLanguage];
// }

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

export function addByComma(orgValue: string, newValue: number | string): string {
  if (typeof newValue === "number") newValue = newValue.toString();
  const arr = orgValue.split(",");
  if (arr.indexOf(newValue) >= 0) return orgValue; // already exists.
  arr.push(newValue);
  return arr
    .filter((v) => {
      return !!v;
    })
    .join(",");
}

export function deleteByComma(orgValue: string, val: number | string): string {
  if (typeof val === "number") val = val.toString();
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
 * @attention It only counts the days after the initial date `til end date.
 * for instance, if we put 2021-11-10 as Begin date and 2021-11-13, it will return 3.
 */
export function daysBetween(date1: string, date2: string): number {
  if (!date1 || !date2) return 0;
  const d2 = dayjs(date2);
  return d2.diff(dayjs(date1), "d");
  // const d1 = new Date(date1).getTime() / 1000;
  // const d2 = new Date(date2).getTime() / 1000;
  // return Math.floor((d2 - d1) / (60 * 60 * 24)) + 1;
}

export function getPageQueryString(): string {
  return window.location.search;
}

/**
 * if you simply need the query params with ? you can use the getPageQueryString
 *
 * @improvement add exclude/include so it can give more benefit and usage
 *
 * @param query - from $route.query
 * @param questionMark  - `default true` it will add the ? on the start of the string
 * @returns
 */
export function currentQueryToString(query: Dictionary<string | (string | null)[]>, questionMark = true): string {
  const arr: string[] = [];

  for (const q in query) {
    arr.push(`${q}=${query[q]}`);
  }
  if (!arr.length) return "";
  return questionMark ? "?" + arr.join("&") : arr.join("&");

  // return window.location.search;
}

export function yymmddhma(s: number): string {
  return dayjs(s * 1000).format("YY-MM-DD h:ma");
}

export function translate(code: string): string {
  if (!code) return "";
  const texts = ApiService.instance.texts;
  if (!ApiService.instance.texts) return code;
  if (!texts[code]) return code;
  if (!texts[code][ApiService.instance.userLanguage]) return code;
  return texts[code][ApiService.instance.userLanguage];
}
