/**
 * @see README 참고
 */

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

export interface PostSearchRequest {
  categoryIdx?: number;
  categoryId?: string;
  subcategory?: string;
  code?: string;
  files?: "Y" | "";
  countryCode?: string;
  searchKey?: string;
  userIdx?: number;
  otherUserIdx?: number;
  order?: string;
  by?: string;
  page?: number;
  limit?: number;
  page?: string;
  comments?: number;
}

export interface MainCafeSettings {
  name: string;
  countryCode: string;
  logo: string;
}

/**
 * cafe settings
 *
 * This setting has all the cafe settings.
 */
export interface CafeSettings {
  mainDomains: string[];
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
  categories: string[];
  maximumAdvertisementDays: number;
}

// export interface ApiStore {
//   user: UserModel;
// countries: ResponseData;
// cafe category model(record) data.
// cafe: CafeModel;
// myCafe: CafeModel[];
// texts: MapStringAny;
// global cafe settings
// cafeSettings: CafeSettings;
// advertisementSettings: AdvertisementSettings;
// Vue vm must be added here.
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
// vm: any;
// router: VueRouter;
// }

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
  idx = "";
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
  // domain = "";

  nicknameOrName = "";

  get loggedIn(): boolean {
    return !!this.idx;
  }
  get notLoggedIn(): boolean {
    return !this.loggedIn;
  }

  /**
   * @deprecated use nicknameOrName
   */
  get displayName(): string {
    if (this.name) return this.name;
    if (this.nickname) return this.nickname;
    let account;
    if (this.email) account = this.email.split("@").shift();
    if (!account) return this.idx + "xxx";
    const first = account.substring(0, account.length - 3);
    return first + "xxx";
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

    return this;
  }
}

export class CommentEditModel {
  idx = 0;
  content = "";
  rootIdx = 0;
  parentIdx = 0;
  files = "";
}

export class PostRootModel {
  parentIdx = 0;

  rootIdx = "";

  url = "";
  path = "";
  relativeUrl = "";

  title = "";
  categoryId = "";
  categoryIdx = "";

  subcategory = "";

  noOfViews = "";
  noOfComments = "0";

  comments: Array<CommentModel> = [];

  privateTitle = "";
  privateContent = "";

  // Advertisement properties
  name = "";
  companyName = "";
  phoneNo = "";
  code = "";
  countryCode = "";

  beginAt = 0;
  endAt = 0;
  beginDate = "";
  endDate = "";

  idx = 0;
  userIdx = "";

  content = "";
  shortDate = "";

  Y = 0;
  N = 0;
  deletedAt = 0;
  depth = "";

  /**
   * client side use only
   */
  inEdit = false;
  inReply = false;

  // `files` is an FileModel object array
  files: Array<FileModel> = [];
  // `fileIndexes` is a string of uploaded file idexes.
  fileIdxes = "";

  user: UserModel = {} as UserModel;

  pointPerDay = 0;

  get isPost(): boolean {
    return !this.parentIdx;
  }
  get isComment(): boolean {
    return !this.isPost;
  }

  get isDeleted(): boolean {
    return this.deletedAt > 0;
  }

  fromJson(map: ResponseData): PostRootModel {
    this.idx = map.idx;
    this.userIdx = map.userIdx;
    this.content = map.content;
    this.shortDate = map.shortDate;
    this.Y = map.Y;
    this.N = map.N;

    this.rootIdx = map.rootIdx;
    this.parentIdx = map.parentIdx;
    this.deletedAt = map.deletedAt;
    this.depth = map.depth;

    this.name = map.name;
    this.phoneNo = map.phoneNo;

    // user
    if (map.user) {
      this.user = new UserModel().fromJson(map.user);
    }

    // files
    if (map.files) {
      this.files = map.files.map((f: JSON) => new FileModel().fromJson(f));
      this.fileIdxes = this.files.map((file) => `${file.idx}`).join(",");
    }

    return this;
  }

  updateVoteCount(map: ResponseData): void {
    this.N = map.N;
    this.Y = map.Y;
  }
}

export class PostModel extends PostRootModel {
  fromJson(map: ResponseData): PostModel {
    this.pointPerDay = map.pointPerDay;
    this.url = map.url;
    this.path = map.path;
    this.relativeUrl = map.relativeUrl;

    this.title = map.title;
    this.categoryIdx = map.categoryIdx;
    this.categoryId = map.categoryId;

    this.noOfViews = map.noOfViews;

    if (map.comments) {
      this.comments = map.comments
        // .filter((c: Obj) => {
        //   return c.deletedAt == "0";
        // })
        .map((c: JSON) => new CommentModel().fromJson(c));
    }

    this.noOfComments = map.noOfComments;

    this.privateTitle = map.privateTitle;
    this.privateContent = map.privateContent;

    this.subcategory = map.subcategory ?? "";

    // Advertisement properties
    this.companyName = map.companyName;
    this.code = map.code;
    this.countryCode = map.countryCode;
    if (map.beginAt) {
      this.beginAt = map.beginAt;
      this.beginDate = map.beginDate;
    }
    if (map.endAt) {
      this.endAt = map.endAt;
      this.endDate = map.endDate;
    }

    super.fromJson(map);
    return this;
  }

  /**
   * Return properties in JSON for submitting to backend.
   */
  get toJson(): MapStringAny {
    return {
      idx: this.idx,
      userIdx: this.userIdx,
      categoryId: this.categoryId,
      categoryIdx: this.categoryIdx,
      title: this.title,
      content: this.content,
      privateTitle: this.privateTitle,
      privateContent: this.privateContent,
      subcategory: this.subcategory,

      // Advertisement properties
      name: this.name,
      companyName: this.companyName,
      phoneNo: this.phoneNo,
      code: this.code,
      countryCode: this.countryCode,
      beginDate: this.beginDate,
      endDate: this.endDate,
      files: this.fileIdxes,
    };
  }

  insertComment(comment: CommentModel): void {
    if (comment.parentIdx == this.idx) {
      this.comments.push(comment);
    } else {
      const index = this.comments.findIndex((c) => c.idx == comment.parentIdx);
      this.comments.splice(index + 1, 0, comment);
    }
  }
}

export class CommentModel extends PostRootModel {
  fromJson(map: ResponseData): CommentModel {
    super.fromJson(map);
    return this;
  }
}

export interface Banner {
  idx?: number;
  bannerUrl?: string;
  clickUrl?: string;
  title?: string;
}

export interface Banners {
  [code: string]: Banner[];
}
export interface CategoryBanners {
  [category: string]: Banners;
}
export class AdvertisementModel extends PostModel {
  advertisementPoint = 0;
  status = "";

  get isActive(): boolean {
    return this.status == "active";
  }
  get isInactive(): boolean {
    return this.status == "inactive";
  }
  get isWaiting(): boolean {
    return this.status == "waiting";
  }

  bannerUrl = "";
  clickUrl = "";
  subcategory = "";

  fromJson(map: ResponseData): AdvertisementModel {
    this.advertisementPoint = map.advertisementPoint ?? 0;
    this.status = map.status ?? "";
    this.bannerUrl = map.bannerUrl;
    this.clickUrl = map.clickUrl ?? "";
    this.subcategory = map.subcategory ?? "";
    super.fromJson(map);
    return this;
  }

  get toJson(): RequestData {
    return {
      idx: this.idx,
      userIdx: this.userIdx,
      categoryId: this.categoryId,
      categoryIdx: this.categoryIdx,
      title: this.title,
      content: this.content,
      privateTitle: this.privateTitle,
      privateContent: this.privateContent,
      subcategory: this.subcategory,

      // Advertisement properties
      name: this.name,
      companyName: this.companyName,
      phoneNo: this.phoneNo,
      code: this.code,
      countryCode: this.countryCode,
      beginDate: this.beginDate,
      endDate: this.endDate,
      files: this.fileIdxes,
      clickUrl: this.clickUrl,
    };
  }
}

export class FileModel {
  idx = "";
  url = "";
  name = "";
  path = "";
  size = "";
  code = "";
  type = "";
  entity = "";
  userIdx = "";
  taxonomy = "";
  createdAt = "";
  updatedAt = "";

  fromJson(map: ResponseData): FileModel {
    this.idx = map.idx;
    this.url = map.url;
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
    return this;
  }
}

export class CategoryModel {
  idx = "";
  userIdx = "";
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
  selectOptions: Array<{ value: string; text: string }> = [];

  fromJson(countries: ResponseData): CountryCurrenciesModel {
    this.countryCurrency = countries;

    const obj: { [index: string]: boolean } = {};
    // filter unique and skip empty code
    for (const c in this.countryCurrency) {
      if (!this.countryCurrency[c].currencyCode) {
        continue;
      }
      obj[this.countryCurrency[c].currencyCode] = true;
    }
    // sort keys
    const sorted = Object.keys(obj).sort();
    // format selectOptions
    for (const i in sorted) {
      this.selectOptions.push({
        value: sorted[i],
        text: sorted[i],
      });
    }

    return this;
  }
}

export interface RequestCafeCreate {
  countryCode: string;
  domain: string;
  rootDomain: string;
}
