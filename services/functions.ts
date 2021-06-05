// export function t(code: string) {
//   console.log(app.translation.texts.login);
//   console.log(app.userLanguage);
//   if (!code) return "";
//   if (!app.translation.texts[code]) return code;
//   return app.translation.texts[code][app.userLanguage];
// }

import store from "@/store";
import { ApiService } from "./api.service";

export function tr(code: string) {
  if (!code) return "";
  if (!store.state.texts[code]) return code;
  return store.state.texts[code][ApiService.instance.userLanguage];
}

export function extractRootDomain(hostname: string): string {
  if (hostname.split(".").length === 1) return hostname;
  else {
    const arr = hostname.split(".");
    return arr[1] + "." + arr[2];
  }
}
