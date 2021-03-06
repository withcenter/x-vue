import axios from "axios";

import {
  RequestData,
  UserModel,
  ResponseData,
  FileModel,
  CafeModel,
  Obj,
  CafeSettings,
  CategoryModel,
  CountryCurrenciesModel,
  MapStringAny,
  RequestCafeCreate,
  FileUploadRequest,
  PointHistoryModel,
  UserActivityModel,
  Settings,
  PassloginResponse,
  CategoryGetsResponse,
  UserStats,
  MapStringString,
  Translations,
} from "../interfaces/interfaces";

import Cookies from "js-cookie";
import { Keys, Err } from "./defines";
import { getRootDomain, translate } from "./functions";
import Vue from "vue";
import { CommentModel, PostModel, PostSearchRequest } from "../interfaces/forum.interface";
import { DataSnapshot, getDatabase, onValue, ref } from "firebase/database";
import { getApp } from "firebase/app";

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
 * Don't include `store` for user state magement.
 * It manages user login state in cookie.
 *
 *
 *
 */
export class ApiService {
  private constructor() {
    /// 로딩 할 때, 바로 사용자 세션 값을 읽어 들여서 최대한 빠르게 사용자 로그인 여부를 판단한다.
    this.sessionId = this.getUserSessionId();
    // console.log("session id; ", this.sessionId);
    /// Add filter `t` for translating.
    /// This must be inside this constructor or somewhere it can be defined
    /// before Vue initialization.
    Vue.filter("t", translate);
  }
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
  private _user: UserModel = new UserModel();

  //
  private sessionId: string | undefined;

  //
  private countries?: ResponseData;

  // 설정
  // 백엔드의 관리자 설정 페이지에서 설정한 것과 기타 시스템 설정이 보관
  // 앱이 실행 될 때마다 다운로드를 해야 한다.
  private _settings?: Settings;

  // 카페 전체 설정
  // 한번만 카페 전체 설정을 가져오고, 그 다음 부터는 메모리에 캐시를 한다.
  private _cafeSettings?: CafeSettings;

  // Translation text
  // This must be set on init and can be updated at anytime.
  // 관리자페이지에서 수정을 하면, ApiService 에서 내부적으로 자동 업데이트를 한다.
  // 먼저, App 에서 texts 가 넘어오고, ApiService 에서 Firebase Realtime Database 를 listen 하고
  // 자동 업데이트를 한다.
  public texts: MapStringAny = {};

  // User change callback
  //
  // This will be called on user activities like
  // - register, login, logout, profile update. But not for profile read.
  //
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
  init(options: {
    apiKey?: string;

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    userChanges: any;
    serverUrl?: string;
    texts?: MapStringAny;
  }): void {
    this.apiKey = options.apiKey ?? "";
    this.serverUrl = options.serverUrl ?? "";
    this.userChanges = options.userChanges;
    this.texts = options.texts ?? {};
    this.initUserAuth();
  }

  /**
   * Firebase ready.
   *
   * Do whatever for firebase work.
   * Firebase 가 초기화되면 이 함수가 호출된다.
   */
  firebaseReady() {
    this.initTranslation();
  }

  // Return server url. If it is not initiallized, then, use current url.
  get endpoint(): string {
    if (this.serverUrl == "") {
      this.serverUrl = location.protocol + "//" + location.hostname + "/index.php";
    }
    return this.serverUrl;
  }

  /**
   * Sets `user` in store.state.
   */
  // public set user(user: UserModel) {
  //   this._user = user;
  // }

  /**
   * Get `user` from store if existing.
   *
   * @returns null | UserModel
   */
  public get user(): UserModel {
    return this._user;
  }

  /**
   * returns true if the user is logged in, false if not.
   * It only checks if session id is available.
   *
   * @returns boolean
   */
  public get loggedIn(): boolean {
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

    /// try/catch 를 통해서, axios 자체에서 발생하는 에러를 처리하기 위해 사용.
    /// 예) 네트워크 접속 에러 등 처리.
    try {
      /// 만약, 접속이나 axios 자체에서 발생하는 에러가 아닌, 프로그램적 에러는 절적한 에러 메시지 리턴.
      const res = await axios.post(this.endpoint, data);
      if (typeof res.data === "string") {
        console.error(res, data);
        throw "error_string_from_php_backend";
      } else if (!res.data.response) {
        throw "error_malformed_response_from_php_backend";
      } else if (typeof res.data.response === "string" && res.data.response.indexOf("error_") === 0) {
        // Backend error code
        if (res.data.response === Err.user_not_found_by_that_session_id) {
          console.log("@ignore User has wrong session id: This may happen on development.");
          this.logout();
        } else if (res.data.response === Err.wrong_session_id) {
          console.log("@ignore User has wrong session id: This may happen on development.");
          this.logout();
        }
        throw res.data.response;
      }
      return res.data.response;
    } catch (e) {
      if (e.message === "Network Error") {
        throw Err.cannot_connect_to_server;
      } else {
        throw e;
      }
    }
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
    // console.log("==> ApiService::initUserAuth()");
    // console.log("==> ApiService::initUserAuth() ==> sessionId has set to: ", this.sessionId);
    if (this.sessionId) {
      await this.refreshLoginUserProfile();
      // console.log("==> ApiService::initUserAuth() ==> refreshLoginUserProfile has done.");
    }
  }

  /**
   * It will refresh the `user` instance in store base on the current `sessionId` saved in the cookie
   *
   * @note it only returns UserModel. It does not return void, or undefined.
   * But it throws an error if there is an error.
   *
   * @returns UserModel
   */
  async refreshLoginUserProfile(): Promise<UserModel> {
    const res = await this.request("user.profile");
    return this.setUserSessionId(res);
  }

  /**
   * Saves `sessionId` in cookie.
   *
   * 여기서 user change 이벤트를 보낸다. 루트앱에서는 이 이벤트를 받아서 로그인 또는 로그아웃을 하면 된다.
   *
   * @param sessionId string
   */
  setUserSessionId(res: ResponseData): UserModel {
    this._user = new UserModel().fromJson(res);
    this.setCookie(Keys.sessionId, this.user.sessionId);
    this.sessionId = this.user.sessionId;

    // console.log('user; ', this.user);

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
    console.log("api login; ", data);
    const res = await this.request("user.login", data);

    return this.setUserSessionId(res);
  }

  /**
   * 카카오 로그인
   *
   * 카카오 로그인을 하면, 정보를 백엔드로 넘기고, 백엔드에서 회원 정보 및 세션 아이디를 받아
   * 웹 브라우저에 보관하는 것으로 로그인이 된다.
   * 즉, 로그인은 백엔드의 세션 아이디가 와야 한다.
   *
   * @param data Kakao login data
   * @returns UserModel
   */
  async kakaoLogin(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.kakaoLogin", data);
    return this.setUserSessionId(res);
  }

  /**
   * "휴대폰번호 PASS 로그인" 콜백으로 받은 code 를 백엔드로 전송해서,
   * 백엔드에서 "휴대폰번호 PASS 로그인" 의 사용자 정보를 받아, 리턴한다.
   * 주의 할 점은, 백엔드에서 가입/로그인/업데이트를 하지 않고 오직 "휴대폰번호 PASS 로그인"의 사용자 정보만 받아 온다.
   * @param data 패스 로그인 코드를 서버로 전송
   * @returns PassloginResponse
   */
  async passloginCallback(data: RequestData): Promise<PassloginResponse> {
    // const res =
    return (await this.request("user.passloginCallback", data)) as PassloginResponse;
    // return this.setUserSessionId(res);
  }

  /**
   *
   * - "휴대폰번호 PASS 로그인" 콜백으로 받은 code 를 백엔드로 전송해서,
   * - 백엔드에서 "PASS 서버"에 접속해서 사용자 정보를 받은 다음,
   *   -- 로그인을 했으면, "PASS 사용자 정보를" 업데이트
   *   -- 아니면, 회원 가입 또는 로그인 후,
   *   -- 회원 정보를 클라이언트로 리턴한다.
   *
   * @param data 패스로그인 코드
   * @returns UserModel
   */
  async passlogin(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.passlogin", data);
    return this.setUserSessionId(res);
  }

  /**
   * 파이어베이스 로그인
   *
   * Matrix README 참고
   *
   * @param data 파이어베이스 로그인 정보
   * @returns 사용자 모델
   */
  async firebaseLogin(data: RequestData): Promise<UserModel> {
    const res = await this.request("user.firebaseLogin", data);
    console.log("firebaseLogin; res;", res);
    return this.setUserSessionId(res);
  }

  async otherUserProfile(uid: number | string): Promise<UserModel> {
    const res = await this.request("user.get", { uid: uid });
    return new UserModel().fromJson(res);
  }
  async otherUsersProfile(uids: string): Promise<UserModel[]> {
    const res = await this.request("user.gets", { uids: uids });
    return res.map((user: JSON) => new UserModel().fromJson(user));
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
    this._user = new UserModel();
    if (this.userChanges != null) this.userChanges(this.user);
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

  /**
   * Returns the posts based on the search request
   * @param data request data
   * @returns posts
   */
  async postSearch(req: PostSearchRequest): Promise<Array<PostModel>> {
    // console.log("postSearch::req", req);
    const res = await this.request("post.search", req);
    // console.log("postSearch::res", res);
    return res.map((post: JSON) => new PostModel().fromJson(post));
  }

  /**
   * Returns the posts minimal properties based on the search request.
   *
   * Note, the difference from `postSearch` is that, it only returns the minimal properties
   *    like title, 255 letters of content, user, and those that are needed to display posts
   *    in widgets.
   *    This may not include like 'updatedAt', 'phoneNo', 'provice', and those that are not
   *    need to display in widgets.
   *
   * See README.md for details.
   *
   * @param data request data
   * @returns posts
   */
  async latestPosts(
    data: PostSearchRequest,
    options?: { callback: (posts: Array<PostModel>) => void }
  ): Promise<Array<PostModel>> {
    // 캐시 코드
    const key = `${data.categoryId}-${data.categoryIdx ?? ""}-${data?.subcategory ?? ""}-${data?.files ?? ""}-${
      data.countryCode ?? ""
    }-${data.searchKey ?? ""}-${data.userIdx ?? ""}-${data.order ?? ""}-${data.page ?? ""}-${data.limit ?? ""}`;

    // 캐시 콜백 함수가 있으면, 캐시 적용
    if (options?.callback) {
      const cache = localStorage.getItem(key);
      if (cache) {
        // console.log("there is cache; ");
        options.callback(JSON.parse(cache).map((post: JSON) => new PostModel().fromJson(post)));
      }
    }
    // 목록을 최소한의 데이터만 가져온다. 이 옵션 하나가 postSearch() 와 다른 것이다.
    data.minimize = true;
    const res = await this.request("post.search", data);

    // 캐시 콜백 함수가 있으면, 캐시
    if (options?.callback) {
      localStorage.setItem(key, JSON.stringify(res));
    }
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
    return new PostModel().fromJson(await this.request("post.delete", { idx: idx }));
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
    params: FileUploadRequest,
    progressCallback: (progress: number) => void
  ): Promise<FileModel> {
    const form = new FormData();
    form.append("route", "file.upload");
    if (this.sessionId) form.append("sessionId", this.sessionId);

    // for (const key in params) {
    //   form.append(key, params[key]);
    // }

    if (params.taxonomy) form.append("taxonomy", params.taxonomy);
    if (params.entity) form.append("entity", params.entity.toString());
    if (params.code) form.append("code", params.code);
    if (params.deletePreviousUpload) form.append("deletePreviousUpload", params.deletePreviousUpload);

    form.append("userfile", file);

    const options = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const p = Math.round((progressEvent.loaded * 100) / progressEvent.total);
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
      throw "error_string_from_php_backend";
    } else if (!res.data.response) {
      throw "error_malformed_response_from_php_backend";
    } else if (typeof res.data.response === "string" && res.data.response.indexOf("error_") === 0) {
      throw res.data.response;
    }
    return new FileModel().fromJson(res.data.response);
  }

  /**
   * Deletes the file with the given `idx`.
   * it will return `idx` when successful.
   *
   * @param idx file idx
   * @returns number - file idx
   */
  async fileDelete(idx: number): Promise<string> {
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
   * Return true if the logged in user is admin.
   */
  get admin(): boolean {
    return this.user.admin;
  }

  /**
   * Returns country data
   *
   * @attention it does memory cache.
   * So, it will connect to backend only one time even if this method is used server times.
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
      language = navigator.languages ? navigator.languages[0] : navigator.language;
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
  getCookie(k: string): string | undefined {
    return Cookies.get(k);
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
  async userSearch(data: RequestData): Promise<UserModel[]> {
    const res = await this.request("user.search", data);
    return res.map((user: JSON) => new UserModel().fromJson(user));
  }

  async userGet(data: RequestData): Promise<UserModel> {
    const user = await this.request("user.get", data);
    return new UserModel().fromJson(user);
  }

  /**
   * Get user profile
   * @returns User model
   */
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

  async userPointHistory(data: RequestData): Promise<Array<PointHistoryModel>> {
    const res = await this.request("user.point", data);
    return res.map((point: JSON) => new PointHistoryModel().fromJson(point));
  }

  async userActivityList(data: RequestData): Promise<Array<UserActivityModel>> {
    const res = await this.request("user-activity.list", data);
    return res.map((activity: JSON) => new UserActivityModel().fromJson(activity));
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

  /**
   * 카테고리를 가져온다.
   *
   * @param idxOrId 카테고리 idx 또는 id. 문자열, 숫자 상관없다.
   * @returns 카테고리
   */
  async categoryGet(idxOrId: number | string): Promise<CategoryModel> {
    const category = await this.request("category.get", { idx: idxOrId });
    return new CategoryModel().fromJson(category);
  }
  async categoryGets(ids: string): Promise<CategoryGetsResponse> {
    const res = await this.request("category.gets", { ids: ids });
    const rets = {} as CategoryGetsResponse;
    for (const id of Object.keys(res)) {
      if (typeof res[id] === "string") {
        rets[id] = res[id];
      } else {
        rets[id] = new CategoryModel().fromJson(res[id]);
      }
    }
    return rets;
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

  /**
   * Get cafe global settings
   * @returns CafeSettings
   *
   * ! It does memory cache
   */
  async loadCafeSettings(): Promise<CafeSettings> {
    if (this._cafeSettings) return this._cafeSettings;
    this._cafeSettings = (await this.request("cafe.settings", {
      domain: this.domain,
    })) as CafeSettings;
    return this._cafeSettings;
  }

  /**
   * Returns login user's cafe list.
   * @returns cafe list
   */
  async myCafeList(): Promise<CafeModel[]> {
    if (this.loggedIn) {
      const res = await this.request("cafe.mine");
      return res.map((cafe: JSON) => new CafeModel().fromJson(cafe));
    } else {
      return [];
    }
  }

  async cafeCreate(data: RequestCafeCreate): Promise<CafeModel> {
    const res = await this.request("cafe.create", data);
    return new CafeModel().fromJson(res);
  }

  async cafeUpdate(data: RequestData): Promise<CafeModel> {
    const res = await this.request("cafe.update", data);
    return new CafeModel().fromJson(res);
  }

  // Get a single cafe setting
  async cafeGet(data: RequestData): Promise<CafeModel> {
    const res = await this.request("cafe.get", data);
    return new CafeModel().fromJson(res);
  }

  // async cafeInitDefautMenu(): Promise<ResponseData> {
  //   return await this.request("cafe.initDefaultCafeMenu");
  // }

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

  async saveToken(token: string, topic = ""): Promise<ResponseData> {
    const res = await this.request("notification.updateToken", {
      token: token,
      topic: topic ?? "",
    });
    // console.log(res);
    return res;
  }

  sendMessageToTopic(data: RequestData): Promise<ResponseData> {
    return this.request("notification.sendMessageToTopic", data);
  }

  sendMessageToTokens(data: RequestData): Promise<ResponseData> {
    return this.request("notification.sendMessageToTokens", data);
  }

  topicSubscription(data: RequestData): Promise<ResponseData> {
    return this.request("notification.topicSubscription", data);
  }

  async isSubscribedToTopic(topic: string, subscribedByDefault = false): Promise<ResponseData> {
    const req: RequestData = {
      topic: topic,
      subscribedByDefault: subscribedByDefault,
    };
    const res = await this.request("notification.isSubscribedToTopic", req);
    // console.log("isSubscribedToTopic::",res);
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
  sendMessageToUsers(data: RequestData): Promise<ResponseData> {
    return this.request("notification.sendMessageToUsers", data);
  }

  async fileGet(data: RequestData): Promise<FileModel> {
    const res = await this.request("file.get", data);
    return new FileModel().fromJson(res);
  }

  async fileSearch(data: RequestData): Promise<FileModel[]> {
    const res = await this.request("file.search", data);
    return res.map((file: JSON) => new FileModel().fromJson(file));
  }

  async fileCount(data: RequestData): Promise<number> {
    const res = await this.request("file.count", data);
    return res && res.count ? res.count : 0;
  }

  openWeatherMap(): Promise<ResponseData> {
    return this.request("open-weather-map.current");
  }

  async getCountryCurrencies(): Promise<CountryCurrenciesModel> {
    const res = await this.request("country.currencies", { ln: "ko" });
    return new CountryCurrenciesModel().fromJson(res);
  }

  getExchangeRate(data: RequestData): Promise<ResponseData> {
    return this.request("currency-converter.get", data);
  }
  /**
   * Set admin settings
   *
   * It saves(or updates) code and data to meta table in backend.
   * Only admin can call this method.
   *
   * @param code code
   * @param data data
   * @returns idx and code will be returned.
   */
  setConfig(code: string, data: number | string): Promise<ResponseData> {
    return this.request("app.setConfig", { code: code, data: data });
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
  getConfig(code: string): Promise<ResponseData> {
    return this.request("app.getConfig", { code: code });
  }

  /**
   * 관리자 설정을 삭제한다.
   * @param code 삭제 할 관리자 설정 코드
   * @returns 에러이면, Exception throw, 성공이면, code
   */
  deleteConfig(code: string): Promise<ResponseData> {
    return this.request("app.deleteConfig", { code: code });
  }

  /**
   * 전체 관리자 설정을 가져온다.
   *
   * ! It memory-caches.
   *
   * @returns 전체 관리자 설정
   */
  async settings(): Promise<Settings> {
    if (this._settings) return this._settings;
    this._settings = (await this.request("app.settings")) as Settings;
    return this._settings;
  }

  /**
   * 번역
   *
   * 1. 앱이 부팅 할 때, 앱에서 기본 texts 를 ApiService.init() 에 지정.
   * 2. 그 직후, 서버로 접속해서 서버의 texts 를 가져와서 texts 업데이트.
   * 3. Firebase realtime database 가 초기화 되면, texts 가 업데이트되는지 listen 해서 업데이트 될 때마다 texts 업데이트.
   *
   * 참고, 여기서 texts 를 업데이트하면, reactive 하게 모든 템플릿이 업데이트 된다.
   */
  initTranslation(): void {
    const db = getDatabase(getApp());
    const translationRef = ref(db, "/notifications/translations");

    // 이 함수는 부팅 시, 처음(자동으로) 한번 호출이 된다.
    onValue(
      translationRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        console.log("글 업데이트 시작;", data);
        this.updateTranslationTexts();
      },
      (e) => {
        console.log("transl; error; ", e);
      }
    );
  }

  async updateTranslationTexts(): Promise<void> {
    try {
      const newTexts = await this.loadTranslation();
      this.texts = Object.assign({}, this.texts, newTexts);
      console.log("글 업데이트 완료;");
    } catch (e) {
      console.error("updateTranslationTexts; error; ", e);
    }
  }

  /**
   *
   * @param form
   * @returns
   */
  async editTranslation(form: MapStringString): Promise<ResponseData> {
    return this.request("translation.update", form);
  }
  async deleteTranslation(code: string): Promise<ResponseData> {
    return this.request("translation.delete", { code: code });
  }

  async loadTranslation(): Promise<Translations> {
    return this.request("translation.load");
  }

  //
  thumbnailUrl(idx: number, width: number, height: number, quality = 95): string {
    return this.serverUrl.replace("index.php", "") + `etc/thumbnail.php?idx=${idx}&w=${width}&h=${height}&q=${quality}`;
  }

  async userStats(): Promise<UserStats> {
    return (await this.request("user.stats")) as UserStats;
  }

  /**
   * Get latest users who has uploaded profile photo.
   * @param limit number to limit users
   * @returns array of user model object
   */
  async latestUserByProfilePhoto(limit = 5): Promise<UserModel[]> {
    const res = await this.request("user.latestByProfilePhoto", { limit: limit });
    return res.map((user: JSON) => new UserModel().fromJson(user));
  }

  async chatSendMessage(data: { otherUserIdx: number; message: string }): Promise<any> {
    const res = await this.request("chat.sendMessage", data);
    return res;
  }
}
