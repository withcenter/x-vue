import axios from "axios";

import {
  RequestData,
  UserModel,
  PostModel,
  CommentModel,
  ResponseData,
  FileModel,
  CafeModel,
  Obj,
  CafeSettings,
  CategoryModel,
  AdvertisementSettings,
  AdvertisementModel,
  CountryCurrenciesModel,
  MapStringAny,
  CategoryBanners,
} from "./interfaces";

import Cookies from "js-cookie";
import { Keys, Err } from "./defines";
import { getRootDomain } from "./functions";
import Vue from "vue";

/**
 * Api Interface.
 *
 * This handles the connections between App and Backend.
 * This does manage the states of
 * - User
 * - User launguage
 * - Translation texts.
 *
 * Don't do anything exception getting data from Backend.
 *   - Don't alert
 *   - Don't move
 *   - Don't save anything.
 *
 * It manages user login state in cookie.
 *
 */
export class ApiService {
  // Singletone
  private static _instance: ApiService;
  public static get instance(): ApiService {
    if (!ApiService._instance) {
      ApiService._instance = new ApiService();
    }
    return ApiService._instance;
  }

  //
  public apiKey = "";

  //
  public serverUrl = "";
  //
  public _user: UserModel = new UserModel();

  //
  private sessionId: string | undefined;

  //
  private countries?: ResponseData;

  //
  private categoryBanners?: CategoryBanners;

  public texts: MapStringAny = {
    email: {
      en: "Email Address",
      ko: "이메일",
    },
  };

  // User change callback
  //
  // This will be called whenever user changes.
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public userChanges: any;

  /**
   * Initialize the Api Service.
   *
   * This must be called before using any other ApiService methods.
   *
   * @see README.md for details.
   *
   * @param options init options
   */
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  init(options: {
    apiKey?: string;
    userChanges: any;
    serverUrl?: string;
  }): void {
    this.apiKey = options.apiKey ?? "";
    this.serverUrl = options.serverUrl ?? "";
    this.userChanges = options.userChanges;
    this.initUserAuth();

    /// @todo move this code somewhere.
    Vue.filter("t", (code: string): string => {
      if (!code) return "";
      if (!this.texts) return code;
      if (!this.texts[code]) return code;
      if (!this.texts[code][ApiService.instance.userLanguage]) return code;
      return this.texts[code][ApiService.instance.userLanguage];
    });
  }

  // Return server url. If it is not initiallized, then, use current url.
  get endpoint(): string {
    if (this.serverUrl == "") {
      this.serverUrl =
        location.protocol + "//" + location.hostname + "/index.php";
    }
    return this.serverUrl;
  }

  /**
   * Sets `user` in store.state.
   */
  private set user(user: UserModel) {
    this._user = user;
  }

  /**
   * Get `user` from store if existing.
   *
   * @returns null | UserModel
   */
  private get user(): UserModel {
    return this._user;
  }

  /**
   * returns true if the user is logged in, false if not.
   * It will check if `this.user` is not null.
   *
   * @returns boolean
   */
  private get loggedIn(): boolean {
    return !!this.sessionId;
  }

  /**
   * return true if user is not logged in, false if logged in.
   *
   * @returns boolean
   */
  private get notLoggedIn(): boolean {
    return !this.loggedIn;
  }

  /**
   * Http Request handler using axios.
   *
   * @param route string - Api call route.
   * @param data additional data to be passed to request.
   * @returns any
   */
  async request(route: string, data: RequestData = {}): Promise<ResponseData> {
    data.route = route;
    if (this.sessionId) data.sessionId = this.sessionId;
    data.apiKey = this.apiKey;
    // console.log("endpoint; ", endpoint);
    const res = await axios.post(this.endpoint, data);
    if (typeof res.data === "string") {
      console.error(res);
      throw "error_error_string_from_php_backend";
    } else if (!res.data.response) {
      throw "error_malformed_response_from_php_backend";
    } else if (
      typeof res.data.response === "string" &&
      res.data.response.indexOf("error_") === 0
    ) {
      // Backend error code
      if (res.data.response === Err.user_not_found_by_that_session_id) {
        console.log(
          "User has wrong session id: This may happen on development."
        );
        this.logout();
      }
      throw res.data.response;
    }
    return res.data.response;
  }

  /**
   * Initialize Auth
   *
   * This will be called only one time when App boots.
   *
   * It will call `getUserSessionId()` to check if `sessionId` is saved in cookie,
   * then it will `refreshLoginUserProfile()` to refresh the user instance in store.state.
   */
  async initUserAuth(): Promise<void> {
    console.log("==> ApiService::initUserAuth()");
    this.sessionId = this.getUserSessionId();
    console.log(
      "==> ApiService::initUserAuth() ==> sessionId has set to: ",
      this.sessionId
    );
    if (this.sessionId) {
      await this.refreshLoginUserProfile();
      console.log(
        "==> ApiService::initUserAuth() ==> refreshLoginUserProfile has done."
      );
    }
  }

  /**
   * It will refresh the `user` instance in store base on the current `sessionId` saved in the cookie
   *
   * @note it only returns UserModel. It does not return void, or undefined. But it throws an error if there is an error.
   *
   * @returns UserModel
   */
  async refreshLoginUserProfile(): Promise<UserModel> {
    console.log("refreshLoginUserProfile() => ");
    const res = await this.request("user.profile");
    console.log("refreshLoginUserProfile() got user data:", res);
    return this.setUserSessionId(res);
  }

  /**
   * Saves `sessionId` in cookie.
   *
   * @param sessionId string
   */
  setUserSessionId(res: ResponseData): UserModel {
    // console.log(res);
    this.user = new UserModel().fromJson(res);
    this.setCookie(Keys.sessionId, this.user.sessionId);
    this.sessionId = this.user.sessionId;

    // if (FirebaseService.instance.token) {
    //   this.saveToken(FirebaseService.instance.token);
    // }

    if (this.userChanges != null) this.userChanges(this.user);

    return this.user;
  }

  /**
   * removes `sessionId` in cookie.
   */
  deleteUserSessionId(): void {
    this.removeCookie(Keys.sessionId);
  }

  /**
   * gets string `sessionId` from cookie, will return `null` if none is saved.
   *
   * @returns string | undefined
   */
  getUserSessionId(): string | undefined {
    this.sessionId = Cookies.get(Keys.sessionId);
    return this.sessionId;
  }

  /**
   * Register.
   *
   * @param data
   * @returns UserModel
   */
  async register(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.register", data);

    return this.setUserSessionId(res);
  }

  /**
   * Login.
   *
   * @param data
   * @returns UserModel
   */
  async login(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.login", data);

    return this.setUserSessionId(res);
  }

  /**
   * Login with Kakao
   * @param data Kakao login data
   * @returns UserModel
   */
  async kakaoLogin(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.kakaoLogin", data);

    return this.setUserSessionId(res);
  }

  async otherUserProfile(idx: string): Promise<UserModel> {
    const res = await this.request("user.otherUserProfile", { idx });
    return new UserModel().fromJson(res);
  }

  /**
   * Logouts user.
   *
   * It deletes the saved `sessionId` from `localStorage`.
   */
  logout(): void {
    // console.log("AppService::logout()", this);
    this.deleteUserSessionId();
    this.sessionId = undefined;
    this.user = new UserModel();
  }

  /**
   * Api call to get App Version.
   *
   * @returns VersionData
   */
  async version(): Promise<string> {
    const res = await this.request("app.version");
    return res.version;
  }

  /**
   * Forum Related
   */
  async postGet(data: RequestData): Promise<PostModel> {
    const res = await this.request("post.get", data);
    return new PostModel().fromJson(res);
  }

  async postSearch(data: RequestData): Promise<Array<PostModel>> {
    const res = await this.request("post.search", data);
    return res.map((post: JSON) => new PostModel().fromJson(post));
  }

  async postCount(data: RequestData): Promise<number> {
    const res = await this.request("post.count", data);
    return res.count;
  }

  async postEdit(data: RequestData): Promise<PostModel> {
    let route = "post.create";
    if (data.idx) {
      route = "post.update";
    }
    const res = await this.request(route, data);
    return new PostModel().fromJson(res);
  }

  async postDelete(idx: number): Promise<PostModel> {
    return new PostModel().fromJson(
      await this.request("post.delete", { idx: idx })
    );
  }

  async commentSearch(data: RequestData): Promise<Array<CommentModel>> {
    if (data.userIdx) {
      data.where = `userIdx=${data.userIdx}`;
    }
    const res = await this.request("comment.search", data);
    return res.map((comment: JSON) => new CommentModel().fromJson(comment));
  }

  async commentEdit(data: RequestData): Promise<CommentModel> {
    let route = "comment.create";
    if (data.idx) {
      route = "comment.update";
    }
    const res = await this.request(route, data);
    return new CommentModel().fromJson(res);
  }

  async commentDelete(idx: number): Promise<CommentModel> {
    const res = await this.request("comment.delete", { idx: idx });
    return new CommentModel().fromJson(res);
  }

  async vote(data: RequestData): Promise<ResponseData> {
    const res = await this.request("post.vote", data);
    return res;
  }

  async fileUpload(
    file: File,
    params: RequestData,
    progressCallback: (progress: number) => void
  ): Promise<FileModel> {
    const form = new FormData();
    form.append("route", "file.upload");
    if (this.sessionId) form.append("sessionId", this.sessionId);

    for (const key in params) {
      form.append(key, params[key]);
    }

    form.append("userfile", file);

    const options = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const p = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (progressCallback) {
          progressCallback(p);
        }
      },
    };

    const res = await axios.post(
      // "https://cherry.philov.com/index.php",
      this.endpoint,
      form,
      options
    );

    if (typeof res.data === "string") {
      console.error(res);
      throw "error_error_string_from_php_backend";
    } else if (!res.data.response) {
      throw "error_malformed_response_from_php_backend";
    } else if (
      typeof res.data.response === "string" &&
      res.data.response.indexOf("error_") === 0
    ) {
      throw res.data.response;
    }
    return new FileModel().fromJson(res.data.response);
  }

  /**
   * Deletes the file with the given `idx`.
   * it will return `idx` when successful.
   *
   * @param idx file idx
   * @returns string - file idx
   */
  async fileDelete(idx: string): Promise<string> {
    const deletedFile = await this.request("file.delete", { idx });
    return deletedFile.idx;
  }

  /**
   * Checks if entity/object belongs to the current logged in user.
   *
   * @todo compatibility with Comment
   * @param obj PostModel
   * @returns boolean
   */
  isMine(obj: PostModel): boolean {
    if (this.notLoggedIn) return false;
    return obj.userIdx === this.user?.idx;
  }

  /**
   * Returns country data
   *
   * @attention it does memory cache. So, it will connect to backend only one time even if this method is used server times.
   *
   * @returns Promise<ResponseData>
   */
  async countryAll(): Promise<ResponseData> {
    if (this.countries) return this.countries;
    this.countries = await this.request("country.all", {
      ln: this.userLanguage,
    });
    return this.countries;
  }

  /// Return user language.
  get userLanguage(): string {
    let language: string;
    const v = Cookies.get("language");
    if (v) {
      language = v;
    } else {
      language = navigator.languages
        ? navigator.languages[0]
        : navigator.language;
    }
    return language.substring(0, 2);
  }

  get domain(): string {
    return location.hostname;
  }
  get rootDomain(): string {
    return getRootDomain(this.domain);
  }

  get cookieDomain(): string | undefined {
    let domain;
    if (this.rootDomain != "localhost") {
      domain = "." + this.rootDomain;
    }
    return domain;
  }

  setCookie(k: string, v: string | Obj): void {
    Cookies.set(k, v, {
      expires: 365,
      domain: this.cookieDomain,
      path: "/",
    });
  }
  removeCookie(k: string): void {
    Cookies.remove(k, {
      expires: 365,
      domain: this.cookieDomain,
      path: "/",
    });
  }

  /**
   * Searches user
   * @param data search options
   * @returns array of UserModel
   */
  async userSearch(data: RequestData): Promise<Array<UserModel>> {
    const res = await this.request("user.search", data);
    return res.map((user: JSON) => new UserModel().fromJson(user));
  }

  async userGet(data: RequestData): Promise<UserModel> {
    const user = await this.request("user.get", data);
    return new UserModel().fromJson(user);
  }

  async userProfile(): Promise<UserModel> {
    const user = await this.request("user.profile");
    return new UserModel().fromJson(user);
  }

  async profileUpdate(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.update", data);
    return this.setUserSessionId(res);
  }

  async userUpdate(data: RequestData): Promise<UserModel> {
    const user = await this.request("user.update", data);
    return new UserModel().fromJson(user);
  }

  async userCount(data: RequestData): Promise<number> {
    const res = await this.request("user.count", data);
    return res && res.count ? res.count : 0;
  }

  ///
  /// Category
  ///
  async categorySearch(data: RequestData): Promise<Array<CategoryModel>> {
    const res = await this.request("category.search", data);
    return res.map((category: JSON) => new CategoryModel().fromJson(category));
  }

  async categoryCount(data: RequestData): Promise<number> {
    const res = await this.request("category.count", data);
    return res && res.count ? res.count : 0;
  }

  async categoryCreate(data: RequestData): Promise<CategoryModel> {
    const category = await this.request("category.create", data);
    return new CategoryModel().fromJson(category);
  }

  async categoryGet(data: RequestData): Promise<CategoryModel> {
    const category = await this.request("category.get", data);
    return new CategoryModel().fromJson(category);
  }

  async categoryUpdate(data: RequestData): Promise<CategoryModel> {
    const category = await this.request("category.update", data);
    return new CategoryModel().fromJson(category);
  }

  async categoryDelete(data: RequestData): Promise<CategoryModel> {
    const category = await this.request("category.delete", data);
    return new CategoryModel().fromJson(category);
  }

  ///
  /// cafe
  ///
  async cafeCreate(data: {
    countryCode: string;
    domain: string;
    rootDomain: string;
  }): Promise<CafeModel> {
    const res = await this.request("cafe.create", data);
    return new CafeModel().fromJson(res);
  }

  async cafeUpdate(data: RequestData): Promise<CafeModel> {
    const res = await this.request("cafe.update", data);
    return new CafeModel().fromJson(res);
  }

  async cafeGet(data: RequestData): Promise<CafeModel> {
    const res = await this.request("cafe.get", data);
    return new CafeModel().fromJson(res);
  }

  async cafeInitDefautMenu(): Promise<ResponseData> {
    return await this.request("cafe.initDefaultCafeMenu");
  }

  // async loadCafe(): Promise<CafeModel> {
  //   const res = await this.request("cafe.get", { domain: this.domain });
  //   store.state.cafe = new CafeModel().fromJson(res);
  //   return store.state.cafe;
  // }

  async cafeSendMessage(data: RequestData): Promise<ResponseData> {
    const res = await this.request("cafe.sendmessage", data);
    return res;
  }

  /**
   * Saves `v` as JSON string.
   *
   * @param k
   * @param v
   */
  setStorage(k: string, v: unknown): void {
    localStorage.setItem(k, JSON.stringify(v));
  }

  /**
   * Returns the data from localStorage after parsnig into JSON object.
   *
   * It returns null if there is no data.
   *
   * @param k
   * @returns null | string
   *
   *
   */
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  getStorage(k: string): any {
    const re = localStorage.getItem(k);
    if (!re) return re;
    return JSON.parse(re);
  }

  // Get cafe global settings
  async loadCafeSettings(): Promise<CafeSettings> {
    return (await this.request("cafe.settings", {
      domain: this.domain,
    })) as CafeSettings;
  }

  /**
   * Get banners from backend.
   *
   * @attention it does memory cache.
   * @param cafeDomain cafe domain to get the banners of
   * @returns banner data
   */
  async loadBanners(cafeDomain: string): Promise<CategoryBanners> {
    if (this.categoryBanners) return this.categoryBanners;

    const res = await this.request("advertisement.loadBanners", {
      cafeDomain: cafeDomain,
    });
    const banners: AdvertisementModel[] = res.map((post: JSON) =>
      new AdvertisementModel().fromJson(post)
    );

    const _banners: CategoryBanners = {};
    if (banners && banners.length) {
      for (const banner of banners) {
        if (!_banners[banner.subcategory]) _banners[banner.subcategory] = {};
        if (!_banners[banner.subcategory][banner.code]) {
          _banners[banner.subcategory][banner.code] = [];
        }

        _banners[banner.subcategory][banner.code].push({
          bannerUrl: banner.bannerUrl,
          clickUrl: banner.clickUrl,
          idx: banner.idx,
          title: banner.title ?? "",
        });
      }
    }

    this.categoryBanners = _banners;
    return this.categoryBanners;
  }

  async advertisementSearch(
    options: RequestData
  ): Promise<Array<AdvertisementModel>> {
    const res = await this.request("advertisement.search", options);
    return res.map((post: JSON) => new AdvertisementModel().fromJson(post));
  }

  async advertisementGet(data: RequestData): Promise<AdvertisementModel> {
    const res = await this.request("advertisement.get", data);
    return new AdvertisementModel().fromJson(res);
  }

  async advertisementEdit(data: RequestData): Promise<AdvertisementModel> {
    const res = await this.request("advertisement.edit", data);
    return new AdvertisementModel().fromJson(res);
  }

  /**
   * @returns Promise<ResponseData>
   */
  async advertisementSettings(): Promise<AdvertisementSettings> {
    return (await this.request(
      "advertisement.settings"
    )) as AdvertisementSettings;
  }

  /**
   * It creates or updates the banner point settings.
   *
   * @param data data to create (or update) the banner point settings.
   * @returns ...
   */
  async advertisementSetBannerPoint(data: RequestData): Promise<ResponseData> {
    return await this.request("advertisement.setBannerPoint", data);
  }

  async advertisementDeleteBannerPoint(idx: string): Promise<ResponseData> {
    return await this.request("advertisement.deleteBannerPoint", { idx });
  }

  /**
   *
   * @returns
   */
  async advertisementGetBannerPoints(): Promise<Array<AdvertisementSettings>> {
    return (await this.request(
      "advertisement.getBannerPoints"
    )) as Array<AdvertisementSettings>;
  }

  async advertisementStart(data: RequestData): Promise<AdvertisementModel> {
    const res = await this.request("advertisement.start", data);
    return new AdvertisementModel().fromJson(res);
  }

  async advertisementStop(idx: number): Promise<AdvertisementModel> {
    const res = await this.request("advertisement.stop", { idx: idx });
    return new AdvertisementModel().fromJson(res);
  }

  async advertisementDelete(idx: number): Promise<AdvertisementModel> {
    const res = await this.request("advertisement.delete", { idx: idx });
    return new AdvertisementModel().fromJson(res);
  }

  async myCafe(): Promise<CafeModel[]> {
    if (this.notLoggedIn) {
      const res = await this.request("cafe.mine");
      return res.map((cafe: JSON) => new CafeModel().fromJson(cafe));
    } else {
      return [];
    }
  }

  async saveToken(token: string, topic = ""): Promise<ResponseData> {
    const res = await this.request("notification.updateToken", {
      token: token,
      topic: topic ?? "",
    });
    // console.log(res);
    return res;
  }

  async sendMessageToTopic(data: RequestData): Promise<ResponseData> {
    const res = await this.request("notification.sendMessageToTopic", data);
    // console.log(res);
    return res;
  }

  async sendMessageToTokens(data: RequestData): Promise<ResponseData> {
    const res = await this.request("notification.sendMessageToTokens", data);
    // console.log(res);
    return res;
  }

  async topicSubscription(data: RequestData): Promise<ResponseData> {
    const res = await this.request("notification.topicSubscription", data);
    console.log(res);
    return res;
  }

  async isSubscribedToTopic(topic: string): Promise<ResponseData> {
    const res = await this.request("notification.isSubscribedToTopic", {
      topic: topic,
    });
    console.log(res);
    return res;
  }

  /**
   *
   * @param data
   * accepts [users] || [emails]
   * - users is an array of idx or string separated by comma
   * - emails is an array of email or string separated by comma
   * @returns
   */
  async sendMessageToUsers(data: RequestData): Promise<ResponseData> {
    const res = await this.request("notification.sendMessageToUsers", data);
    // console.log(res);
    return res;
  }

  async fileGet(data: RequestData): Promise<FileModel> {
    const res = await this.request("file.get", data);
    return new FileModel().fromJson(res);
  }

  async openWeatherMap(): Promise<ResponseData> {
    return await this.request("open-weather-map.current");
  }

  async getCountryCurrencies(): Promise<CountryCurrenciesModel> {
    const res = await this.request("country.currencies");
    return new CountryCurrenciesModel().fromJson(res);
  }

  async getExchangeRate(data: RequestData): Promise<ResponseData> {
    return await this.request("currency-converter.get", data);
  }
  /**
   * Set admin settings
   *
   * It saves(or updates) code and data to meta table in backend.
   * Only admin can call this method.
   *
   * @param c code
   *
   * @param d data
   * @returns idx and code will be returned.
   */
  async setConfig(c: string, d: number | string): Promise<ResponseData> {
    return await this.request("app.setConfig", { code: c, data: d });
  }
  /**
   * Get admin settings.
   *
   *
   * ! Note, user can read the settings. but cannot change it.
   *
   * @param c code
   * @returns data
   */
  async getConfig(c: string): Promise<ResponseData> {
    return await this.request("app.getConfig", { code: c });
  }
}
