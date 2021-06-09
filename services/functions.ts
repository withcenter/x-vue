// export function t(code: string) {
//   console.log(app.translation.texts.login);
//   console.log(app.userLanguage);
//   if (!code) return "";
//   if (!app.translation.texts[code]) return code;
//   return app.translation.texts[code][app.userLanguage];
// }

import store from "@/store";
import { ApiService } from "./api.service";

export function tr(code: string): string {
  if (!code) return "";
  if (!store.state.texts) return code;
  if (!store.state.texts[code]) return code;
  if (!store.state.texts[code][ApiService.instance.userLanguage]) return code;
  return store.state.texts[code][ApiService.instance.userLanguage];
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
