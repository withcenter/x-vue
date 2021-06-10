import { ApiStore, CafeSettings, UserModel, CafeModel } from "./interfaces";

export default {
  user: new UserModel(),
  countries: {},
  cafe: new CafeModel(),
  cafeSettings: {} as CafeSettings,
  texts: {},
  advertisementSettings: {},
  vm: {},
} as ApiStore;
