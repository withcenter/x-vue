import {
  ApiStore,
  GlobalCafeSettings,
  UserModel,
  CafeModel,
} from "./interfaces";

/**
 * @attention This will be copied into `Vuex store`. This may not be reactive.
 * @attention Do not use this as state manager. Use root app's `store`.
 */
export default {
  user: new UserModel(),
  countries: {},
  cafe: new CafeModel(),
  myCafe: [] as CafeModel[],
  globalCafeSettings: {} as GlobalCafeSettings,
  texts: {},
  advertisementSettings: {},
} as ApiStore;
