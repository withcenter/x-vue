/**
 * @see README 참고
 */

import { PostModel } from "./forum.interface";

//
export interface MapStringAny {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [index: string]: any;
}
export interface MapStringString {
  [index: string]: string;
}
export interface MapStringStringArray {
  [index: string]: string[];
}

export interface MapStringStringAny {
  [index: string]: MapStringAny;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type Obj = Record<string, any>;

export interface RequestData {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [index: string]: any;
  route?: string;
  sessionId?: string;
}

export interface ResponseData {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [index: string]: any;
}

export interface FileUploadRequest {
  taxonomy?: string;
  entity?: number;
  code?: string;
  deletePreviousUpload?: "Y" | "";
}

export interface MainCafeSettings {
  name: string;
  countryCode: string;
  logo: string;
}

/**
 * Admin settings
 */
export interface Settings {
  enableLike: "" | "Y" | "N";
  disableLike: "" | "Y" | "N";
  privacyPolicy: string;
  searchCategories: string;
  termsAndConditions: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [index: string]: any;
}

/**
 * cafe settings
 *
 * This setting has all the cafe settings.
 */
export interface CafeSettings {
  mainCafeDomains: string[];
  countryDomains: string[];
  mainCafeSettings: { [index: string]: MainCafeSettings };
  mainMenus: string[];
  sitemap: MapStringStringArray;
}

export interface AdvertisementPointSetting {
  idx?: number;
  countryCode: string;
  top: number;
  sidebar: number;
  square: number;
  line: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface AdvertisementSettings {
  types: string[];
  point: {
    default: AdvertisementPointSetting;
    [index: string]: AdvertisementPointSetting;
  };
  categoryArray: string[];
  maximumAdvertisementDays: number;
}

export interface KakaoUserMe {
  id: number;
  kakao_account: {
    profile: {
      nickname: string;
      profile_image_url: string;
      thumbnail_image_url: string;
    };
    account_email: string;
    age_range: string;
    birthday: string; // MMDD 형식. 월/일
    birthyear: string; // YYYY 태어난 해.
    gender: "male" | "female";
    phone_number: string;
    account_ci: string;
  };
}

export class UserModel {
  idx = 0;
  sessionId = "";
  email = "";
  name = "";
  nickname = "";
  photoUrl = "";
  admin = false;

  //extra user info
  point = 0;
  firebaseUid = "";
  phoneNo = "";
  gender = "";
  birthdate = 0;
  countryCode = "";
  province = "";
  city = "";
  address = "";
  zipcode = "";
  block = false;

  createdAt = 0;
  updatedAt = 0;
  // domain = "";

  verifier = "";

  nicknameOrName = "";

  get loggedIn(): boolean {
    return !!this.idx;
  }
  get notLoggedIn(): boolean {
    return !this.loggedIn;
  }

  get displayName(): string {
    return this.nicknameOrName;
  }

  get verified(): boolean {
    return this.verifier != "";
  }

  fromJson(map: ResponseData): UserModel {
    this.idx = map.idx;
    this.email = map.email;
    this.sessionId = map.sessionId;
    this.name = map.name;
    this.nickname = map.nickname;
    this.photoUrl = map.photoUrl;
    this.admin = map.admin == "Y" ? true : false;

    this.point = map.point;
    this.firebaseUid = map.firebaseUid;
    this.phoneNo = map.phoneNo;
    this.gender = map.gender;
    this.birthdate = map.birthdate;
    this.countryCode = map.countryCode;
    this.province = map.province;
    this.city = map.city;
    this.address = map.address;
    this.zipcode = map.zipcode;
    this.block = map.block == "Y" ? true : false;
    this.nicknameOrName = map.nicknameOrName;
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;
    this.verifier = map.verifier;
    return this;
  }
}

export class FileModel {
  idx = 0;
  url = "";
  thumbnailUrl = "";
  name = "";
  path = "";
  size = 0;
  code = "";
  type = "";
  entity = 0;
  userIdx = 0;
  taxonomy = "";
  createdAt = 0;
  updatedAt = 0;

  shortDate = "";

  user: UserModel = {} as UserModel;

  post: PostModel = {} as PostModel;

  fromJson(map: ResponseData): FileModel {
    this.idx = map.idx;
    this.url = map.url;
    this.thumbnailUrl = map.thumbnailUrl;
    this.name = map.name;
    this.path = map.path;
    this.size = map.size;
    this.code = map.code;
    this.type = map.type;
    this.entity = map.entity;
    this.userIdx = map.userIdx;
    this.taxonomy = map.taxonomy;
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;

    this.shortDate = map.shortDate;

    // user
    if (map.user) {
      this.user = new UserModel().fromJson(map.user);
    }

    // post with idx, title, content
    if (map.post) {
      this.post = new PostModel().fromJson(map.post);
    }
    return this;
  }
}

export class CategoryModel {
  idx = 0;
  userIdx = 0;
  id = "";
  title = "";
  description = "";
  subcategories = "";
  createPost = "";
  deletePost = "";
  createComment = "";
  deleteComment = "";
  createHourLimit = "";
  createHourLimitCount = "";
  createDailyLimitCount = "";
  banCreateOnLimit = "";
  postCreateLimit = "";
  commentCreateLimit = "";
  readLimit = "";
  returnToAfterPostEdit = "";
  postEditWidget = "";
  postEditWidgetOption = "";
  postViewWidget = "";
  postListHeaderWidget = "";
  postListWidget = "";
  paginationWidget = "";
  listOnView = "";
  noOfPostsPerPage = "";
  noOfPagesOnNav = "";

  // This domain is a root domain. Not subdomain. For cafe, the subdomain(complete domain) is the id.
  domain = "";

  //
  verifiedUserCreatePost: "" | "Y" | "N" = "";
  verifiedUserCreateComment: "" | "Y" | "N" = "";
  verifiedUserView: "" | "Y" | "N" = "";

  fromJson(map: ResponseData): CategoryModel {
    this.idx = map.idx;
    this.userIdx = map.userIdx;
    this.id = map.id;
    this.title = map.title;
    this.description = map.description;
    this.subcategories = map.subcategories;
    this.createPost = map.createPost;
    this.deletePost = map.deletePost;
    this.createComment = map.createComment;
    this.deleteComment = map.deleteComment;
    this.createHourLimit = map.createHourLimit;
    this.createHourLimitCount = map.createHourLimitCount;
    this.createDailyLimitCount = map.createDailyLimitCount;
    this.banCreateOnLimit = map.banCreateOnLimit;
    this.postCreateLimit = map.postCreateLimit;
    this.commentCreateLimit = map.commentCreateLimit;
    this.readLimit = map.readLimit;
    this.returnToAfterPostEdit = map.returnToAfterPostEdit;
    this.postEditWidget = map.postEditWidget;
    this.postEditWidgetOption = map.postEditWidgetOption;
    this.postViewWidget = map.postViewWidget;
    this.postListHeaderWidget = map.postListHeaderWidget;
    this.postListWidget = map.postListWidget;
    this.paginationWidget = map.paginationWidget;
    this.listOnView = map.listOnView;
    this.noOfPostsPerPage = map.noOfPostsPerPage;
    this.noOfPagesOnNav = map.noOfPagesOnNav;
    this.verifiedUserCreatePost = map.verifiedUserCreatePost;
    this.verifiedUserCreateComment = map.verifiedUserCreateComment;
    this.verifiedUserView = map.verifiedUserView;

    this.domain = map.domain;
    return this;
  }
}

export class CafeModel extends CategoryModel {
  // cafe
  app_name = "";
  app_background_color = "";
  tokenCount = 0;
  subcategoriesArray: string[] = [];
  titleImageUrl = "";
  countryCode = "";

  fromJson(map: ResponseData): CafeModel {
    this.app_name = map.app_name;
    this.app_background_color = map.app_background_color ?? "";
    this.tokenCount = map.tokenCount ?? 0;
    this.subcategoriesArray = map.subcategoriesArray;
    this.titleImageUrl = map.titleImageUrl;
    this.countryCode = map.countryCode;
    super.fromJson(map);
    return this;
  }
}

export interface CountryCurrency {
  [index: string]: {
    currencyCode: string;
    currencySymbol: string;
    currencyKoreanName: string;
  };
}

export class CountryCurrencyModel {
  currencyCode = "";
  currencySymbol = "";
  currencyKoreanName = "";

  fromJson(map: ResponseData): CountryCurrencyModel {
    this.currencyCode = map.currencyCode;
    this.currencySymbol = map.currencySymbol;
    this.currencyKoreanName = map.currencyKoreanName;
    return this;
  }
}

/**
 * countryCurrency and selectedOptions which can be use on select options of vue bootstrap
 *
 *
 *
 */
export class CountryCurrenciesModel {
  countryCurrency: CountryCurrency = {};
  // selectOptionsCurrencyCode: Array<{ value: string; text: string }> = [];

  selectOptionsCountryName: Array<{ value: string; text: string }> = [];

  fromJson(countries: ResponseData): CountryCurrenciesModel {
    this.countryCurrency = countries;
    for (const c in this.countryCurrency) {
      //Skip if country dont have currencyCode.
      if (!this.countryCurrency[c].currencyCode) {
        continue;
      }
      this.selectOptionsCountryName.push({
        value: c,
        text: c,
      });
    }

    // const obj: { [index: string]: boolean } = {};
    // // filter unique and skip empty code
    // for (const c in this.countryCurrency) {
    //   if (!this.countryCurrency[c].currencyCode) {
    //     continue;
    //   }
    //   obj[this.countryCurrency[c].currencyCode] = true;
    // }
    // // sort keys
    // const sorted = Object.keys(obj).sort();
    // // format selectOptions
    // for (const i in sorted) {
    //   this.selectOptionsCurrencyCode.push({
    //     value: sorted[i],
    //     text: sorted[i],
    //   });
    // }

    return this;
  }
}

export interface RequestCafeCreate {
  countryCode: string;
  domain: string;
  rootDomain: string;
}

export class PointHistoryModel {
  idx = 0;
  action = "";
  taxonomy = "";
  categoryIdx = 0;
  entity = 0;
  fromUserIdx = 0;
  fromUserPointAfter = 0;
  fromUserPointApply = 0;
  toUserIdx = 0;
  toUserPointAfter = 0;
  toUserPointApply = 0;

  createdAt = 0;
  updatedAt = 0;

  // createdAtShortDate = "";
  // updatedAtShortDate = "";
  fromJson(map: ResponseData): PointHistoryModel {
    this.idx = map.idx;
    this.action = map.action;
    this.categoryIdx = map.categoryIdx;
    this.entity = map.entity;
    this.fromUserIdx = map.fromUserIdx;
    this.fromUserPointAfter = map.fromUserPointAfter;
    this.fromUserPointApply = map.fromUserPointApply;
    this.taxonomy = map.taxonomy;
    this.toUserIdx = map.toUserIdx;
    this.toUserPointAfter = map.toUserPointAfter;
    this.toUserPointApply = map.toUserPointApply;

    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;

    // this.createdAtShortDate = map.createdAtShortDate;
    // this.updatedAtShortDate = map.updatedAtShortDate;

    return this;
  }
}

export class UserActivityModel extends PointHistoryModel {
  fromUser = new UserModel();
  toUser = new UserModel();
  fromJson(map: ResponseData): UserActivityModel {
    this.fromUser = new UserModel().fromJson(map.fromUser);
    this.toUser = new UserModel().fromJson(map.toUser);
    super.fromJson(map);
    return this;
  }
}

export interface PassloginResponse {
  agegroup: string;
  autoStatusCheck: "Y" | "N";
  birthdate: string;
  ci: string;
  foreign: string;
  gender: "M" | "F";
  name: string;
  phoneNo: string;
  plid: string;
  telcoCd: string;
}
