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

export interface RootDomainSettings {
  [index: string]: {
    name: string;
    countryCode: string;
    logo: string;
  };
}

/**
 *
 */
export interface CafeSettings {
  mainDomains: string[];
  countryDomains: string[];
  rootDomainSettings: RootDomainSettings;
  mainMenus: string[];
  sitemap: MapStringStringArray;
}

export interface ApiState {
  user: undefined | UserModel;
  countries: ResponseData | undefined;
  // cafe category model(record) data.
  cafe: CafeModel | undefined;
  texts: MapStringAny;
  // cafe settings only
  cafeSettings: CafeSettings;
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
  idx = "";
  sessionId = "";
  email = "";
  name = "";
  nickname = "";
  photoUrl = "";
  admin = false;

  // Returns name or nickname or email.
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
    return this;
  }
}

export class PostEditModel {
  idx = "";
  title = "";
  content = "";
  categoryId = "";
  files = "";
}

export class CommentEditModel {
  idx = "";
  content = "";
  rootIdx = "";
  parentIdx = "";
  files = "";
}

export class PostRootModel {
  idx = "";
  userIdx = "";

  content = "";
  shortDate = "";

  Y = 0;
  N = 0;

  files: Array<FileModel> = [];

  user: UserModel = {} as UserModel;

  fromJson(map: ResponseData): PostRootModel {
    this.idx = map.idx;
    this.userIdx = map.userIdx;
    this.content = map.content;
    this.shortDate = map.shortDate;
    this.Y = map.Y;
    this.N = map.N;

    // user
    if (map.user) {
      this.user = new UserModel().fromJson(map.user);
    }

    // files
    if (map.files) {
      this.files = map.files.map((f: JSON) => new FileModel().fromJson(f));
    }

    return this;
  }

  updateVoteCount(map: ResponseData): void {
    this.N = map.N;
    this.Y = map.Y;
  }
}

export class PostModel extends PostRootModel {
  url = "";
  path = "";
  relativeUrl = "";

  title = "";
  categoryIdx = "";

  noOfViews = "";

  comments: Array<CommentModel> = [];

  get noOfComments(): number {
    return this.comments.length;
  }

  fromJson(map: ResponseData): PostModel {
    this.url = map.url;
    this.path = map.path;
    this.relativeUrl = map.relativeUrl;

    this.title = map.title;
    this.categoryIdx = map.categoryIdx;

    this.noOfViews = map.noOfViews;

    this.comments = map.comments
      .filter((c: Obj) => {
        return c.deletedAt == "0";
      })
      .map((c: JSON) => new CommentModel().fromJson(c));

    super.fromJson(map);
    return this;
  }

  insertComment(comment: CommentModel): void {
    if (comment.parentIdx == this.idx) {
      this.comments.push(comment);
    } else {
      const index = this.comments.findIndex((c) => c.idx == comment.parentIdx);
      this.comments.splice(index + 1, 0, comment);
    }
  }

  deleteComment(idx: string): void {
    const index = this.comments.findIndex((c) => c.idx == idx);
    this.comments.splice(index, 1);
  }
}

export class CommentModel extends PostRootModel {
  rootIdx = "";
  parentIdx = "";
  deletedAt = "";
  depth = "";

  /**
   * client side use only
   */
  inEdit = false;
  inReply = false;

  fromJson(map: ResponseData): CommentModel {
    this.rootIdx = map.rootIdx;
    this.parentIdx = map.parentIdx;
    this.deletedAt = map.deletedAt;
    this.depth = map.depth;

    super.fromJson(map);
    return this;
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

  // This domain is a root domain. Not subdomain. For cafe, the subdomain(complete domain) is the id.
  domain = "";

  fromJson(map: ResponseData): this {
    this.idx = map.idx;
    this.userIdx = map.userIdx;
    this.id = map.id;
    this.title = map.title;
    this.description = map.description;
    this.domain = map.domain;
    return this;
  }
}

export class CafeModel extends CategoryModel {}
