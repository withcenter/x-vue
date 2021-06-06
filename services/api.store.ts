import { ApiState, CafeSettings } from "./interfaces";

export const apiState: ApiState = {
  user: undefined,
  countries: undefined,
  cafe: undefined,
  cafeSettings: new CafeSettings(),
  texts: {},
};
