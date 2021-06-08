import axios from "axios";

import store from "@/store";
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
} from "./interfaces";

import Cookies from "js-cookie";
import { Keys } from "@/x-vue/services/defines";
import { extractRootDomain, tr } from "./functions";

export class ApiService {
  private static _instance: ApiService;

  private constructor() {
    this.initUserAuth();
  }

  public static get instance(): ApiService {
    if (!ApiService._instance) {
      ApiService._instance = new ApiService();
    }

    return ApiService._instance;
  }

  private sessionId: string | undefined;

  /**
   * Sets `user` in store.
   */
  set user(user: undefined | UserModel) {
    store.state.user = user;
  }

  /**
   * Get `user` from store if existing.
   *
   * @returns null | UserModel
   */
  get user(): undefined | UserModel {
    return store.state.user;
  }

  /**
   * returns true if the user is logged in, false if not.
   * It will check if `this.user` is not null.
   *
   * @returns boolean
   */
  get loggedIn(): boolean {
    return !!this.user && !!this.user.idx;
  }

  /**
   * return true if user is not logged in, false if logged in.
   *
   * @returns boolean
   */
  get notLoggedIn(): boolean {
    return !this.loggedIn;
  }

  /**
   * Initialize Auth
   * It will call `getUserSessionId()` to check if `sessionId` is saved in cookie,
   * then it will `refreshLoginUserProfile()` to refresh the user instance in store.
   */
  async initUserAuth(): Promise<void> {
    this.sessionId = this.getUserSessionId();
    await this.refreshLoginUserProfile();
  }

  /**
   * It will refresh the `user` instance in store base on the current `sessionId` saved in the cookie
   *
   * @returns UserModel
   */
  async refreshLoginUserProfile(): Promise<UserModel | void> {
    if (!this.sessionId) return;
    const res = await this.request("user.profile");

    return this.setUserSessionId(res);
  }

  /**
   * Saves `sessionId` in cookie.
   *
   * @param sessionId string
   */
  setUserSessionId(res: ResponseData): UserModel {
    console.log(res);
    this.user = new UserModel().fromJson(res);
    console.log(this.user);
    this.setCookie(Keys.sessionId, this.user.sessionId);
    this.sessionId = this.user.sessionId;
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

  /**
   * Logouts user.
   *
   * It deletes the saved `sessionId` from `localStorage`.
   */
  logout(): void {
    // console.log("AppService::logout()", this);
    this.deleteUserSessionId();
    this.sessionId = undefined;
    this.user = undefined;
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
    const host = location.hostname;
    const endpoint = `https://${host}/index.php`;
    console.log("endpoint; ", endpoint);
    const res = await axios.post(endpoint, data);
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
    return res.data.response;
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

  async postDelete(idx: string): Promise<PostModel> {
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

  async commentDelete(idx: string): Promise<CommentModel> {
    const res = await this.request("comment.delete", { idx: idx });
    return new CommentModel().fromJson(res);
  }

  async vote(data: RequestData): Promise<ResponseData> {
    const res = await this.request("post.vote", data);
    return res;
  }

  fileUpload(
    file: File,
    params: RequestData,
    successCallback: (file: FileModel) => void,
    errorCallback: (e: string) => void,
    progressCallback: (progress: number) => void
  ): void {
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

    axios
      .post("https://cherry.philov.com/index.php", form, options)
      .then((res) => {
        if (
          typeof res.data.response === "string" &&
          res.data.response.indexOf("error_") === 0
        ) {
          errorCallback(res.data.response);
        } else {
          const _file = new FileModel().fromJson(res.data.response);
          successCallback(_file);
        }
      })
      .catch(errorCallback);
  }

  /**
   * Deletes the file with the given `idx`.
   * it will return `idx` when successful.
   *
   * @param idx file idx
   * @returns string - file idx
   */
  async fileDelete(idx: string): Promise<ResponseData> {
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

  async countryAll(): Promise<ResponseData> {
    store.state.countries = await this.request("country.all", {
      ln: this.userLanguage,
    });
    return store.state.countries;
  }

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
    return extractRootDomain(this.domain);
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

    console.log(res);
    return res.map((user: JSON) => new UserModel().fromJson(user));
  }

  async userGet(data: RequestData): Promise<UserModel> {
    const user = await this.request("user.get", data);
    return new UserModel().fromJson(user);
  }

  async userCount(data: RequestData): Promise<number> {
    const res = await this.request("user.count", data);
    console.log(res);
    return res && res.count ? res.count : 0;
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

  async loadCafe(): Promise<CafeModel> {
    const res = await this.request("cafe.get", { domain: this.domain });
    store.state.cafe = new CafeModel().fromJson(res);
    return store.state.cafe;
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

  async loadCafeSettings(): Promise<CafeSettings> {
    // 캐시된 데이터가 있으면 리턴
    const json = this.getStorage("cafeSettings");
    if (json) {
      store.state.cafeSettings = json as CafeSettings;
    }
    // 서버로 부터 데이터를 가져와 캐시
    const res = await this.request("cafe.settings", { domain: this.domain });
    store.state.cafeSettings = res as CafeSettings;
    this.setStorage("cafeSettings", store.state.cafeSettings);
    return store.state.cafeSettings;
  }

  /**
   * 현재 카페 설정을 리턴한다.
   * @returns
   */
  currentCafeSettings(): Obj | undefined {
    if (
      store.state.cafeSettings &&
      store.state.cafeSettings["rootDomainSettings"] &&
      store.state.cafeSettings["rootDomainSettings"][this.rootDomain]
    ) {
      return store.state.cafeSettings["rootDomainSettings"][this.rootDomain];
    }
  }

  /**
   * Display error alert box
   *
   * Note, use this method from the app.
   *
   * @param code Error code from PHP backend
   * @returns true after the alert dialog closed
   */
  error(code: string): Promise<boolean> {
    if (typeof code === "string" && code.indexOf("error_") === 0) {
      // This is a PHP backend erorr
      return this.alert(tr("error"), tr(code));
    } else {
      return this.alert(tr("error"), "Unknown error: " + code);
    }
  }

  /**
   * Returns true when the confirm box has closed.
   *
   * Note, use this method from the app.
   *
   * @param title title
   * @param content content
   * @returns boolean
   */
  async alert(title: string, content: string): Promise<boolean> {
    return await store.state.vm.$bvModal.msgBoxOk(content, {
      title: title,
      size: "sm",
      buttonSize: "sm",
      okVariant: "success",
      headerClass: "p-2 border-bottom-0",
      footerClass: "p-2 border-top-0",
    });
  }

  /**
   * Ask user for confirmation
   *
   * Note, use this method from the app.
   *
   * @param title title
   * @param content content
   * @returns boolean|null
   *  - true on yes
   *  - false on no
   *  - null if close without confirmation
   * @example
   * ```
   *  console.log("confirm; ", await this.app.confirm("title", "content"));
   * ```
   */
  async confirm(title: string, content: string): Promise<boolean | null> {
    return await store.state.vm.$bvModal.msgBoxConfirm(content, {
      title: title,
      size: "sm",
      buttonSize: "sm",
      okVariant: "danger",
      okTitle: tr("yes"),
      cancelTitle: tr("no"),
      footerClass: "p-2",
      hideHeaderClose: false,
      centered: true,
    });
  }
}
