import { ApiService } from "../services/api.service";
import { FileModel, MapStringAny, ResponseData, UserModel } from "./interfaces";

/**
 *
 * 예제) 정렬 조건을 보다 복잡하게 하기
 *      아래와 같이 by 에 빈 값을 입력하고, order 에 원하는 여러개의 정렬 조건 항목을 입력 할 수 있다.
 *      order: "noOfComments DESC, createdAt DESC",
 *      by: "",
 */
export interface PostSearchRequest {
  categoryIdx?: number;
  categoryId?: string;
  ids?: string;
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
  comments?: number;
  minimize?: boolean;
  within?: number;
  betweenFrom?: number;
  betweenTo?: number;
}

/**
 * Forum interface that can be used for post list, edit
 */
export class ForumInterface {
  /// post list
  posts: PostModel[] = [];
  /// post to create, edit
  post: PostModel = new PostModel();
  /// page no
  page = 0;
  limit = 12;
  loading = false;
  noMore = false;
  categoryId = "";

  userIdx = 0;
  subCategory = "";
  comments = 0;

  get searchOptions(): PostSearchRequest {
    const opts: PostSearchRequest = {
      categoryId: this.categoryId,
      page: this.page,
      limit: this.limit,
    };

    if (this.subCategory) opts.subcategory = this.subCategory;
    if (this.comments) opts.comments = this.comments;
    if (this.userIdx) opts.userIdx = this.userIdx;

    return opts;
  }

  get canLoad(): boolean {
    return this.loading || this.noMore;
  }
  beginLoad(): void {
    this.loading = true;
    this.page++;
  }
  endLoad(): void {
    this.loading = false;
  }

  /**
   * Set the forum on post edit mode.
   *
   * 글 수정은 `ForumInterface.post` 의 `inEdit` 값에 따라 결정이 된다.
   * 즉, 현재 모델의 `post` 에 수정 할 글을 기록해 놓아야 하는 것이다.
   *
   * @param post post to edit
   */
  toEdit(post: PostModel): void {
    this.post = post;
    this.post.toEdit();
  }
}

export class CommentEditModel {
  idx = 0;
  content = "";
  rootIdx = 0;
  parentIdx = 0;
  fileIdxes = "";
  files: FileModel[] = [];
}

export class PostRootModel {
  parentIdx = 0;

  rootIdx = 0;

  url = "";
  path = "";
  relativeUrl = "";

  title = "";
  categoryId = "";
  categoryIdx = 0;

  subcategory = "";

  noOfViews = "";
  noOfComments = 0;

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
  userIdx = 0;

  content = "";
  shortDate = "";

  Y = 0;
  N = 0;
  deletedAt = 0;
  depth = 0;

  /**
   * client side use only
   * `inEdit` becomes true when user pressed for creating or editing.
   * `inEdit` 의 값이 참이면, 화면에 수정 버튼을 보여주면 된다.
   */
  inEdit = false;

  /**
   *
   */
  inReply = false;

  inView = false;

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

  /**
   * Return true if deleted
   */
  get isDeleted(): boolean {
    return this.deletedAt > 0;
  }
  /**
   * Return true if deleted
   */
  get deleted(): boolean {
    return this.isDeleted;
  }
  /**
   * Return true if NOT deleted
   */
  get notDeleted(): boolean {
    return !this.deleted;
  }

  fromJson(map: ResponseData): PostRootModel {
    this.idx = map.idx ?? 0;
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

  /**
   * Return properties in JSON for submitting to backend.
   */
  public get toJson(): MapStringAny {
    return {
      idx: this.idx,
      parentIdx: this.parentIdx,
      rootIdx: this.rootIdx,
      userIdx: this.userIdx,
      categoryId: this.categoryId,
      categoryIdx: this.categoryIdx,

      title: this.title,
      content: this.content,
      privateTitle: this.privateTitle,
      privateContent: this.privateContent,
      subcategory: this.subcategory,

      beginAt: this.beginAt,
      endAt: this.endAt,

      Y: this.Y,
      N: this.N,
      deletedAt: this.deletedAt,
      depth: this.depth,

      user: this.user,
      //

      url: this.url,
      path: this.path,
      relativeUrl: this.relativeUrl,

      // Advertisement properties
      name: this.name,
      companyName: this.companyName,
      phoneNo: this.phoneNo,
      code: this.code,
      countryCode: this.countryCode,
      beginDate: this.beginDate,
      endDate: this.endDate,
      files: this.files,
      fileIdxes: this.fileIdxes,
    };
  }

  empty(): void {
    this.fromJson({});
  }

  /**
   * Update vote count
   * @param json json response from backend
   */
  updateVoteCount(json: ResponseData): void {
    this.N = json.N;
    this.Y = json.Y;
  }

  /**
   * Vote
   *
   * You may want to handle the exception.
   *
   * @param choice like or dislike choice
   */
  async like(choice: "Y" | "N" = "Y"): Promise<void> {
    const res = await ApiService.instance.vote({
      idx: this.idx,
      choice: choice,
    });
    console.log("res; ", res);
    this.updateVoteCount(res);
  }
  async dislike(): Promise<void> {
    return this.like("N");
  }

  markDeleted(): void {
    this.deletedAt = new Date().getTime();
    this.title = "";
    this.content = "";
    this.privateTitle = "";
    this.privateContent = "";
  }
}

/**
 * Post model
 *
 * To clean(clear, reset) the model, just call `model.fromJson({})`.
 */
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
   * Replace current post model with the input.
   * @param post post to replace
   */
  copyWith(post: PostModel): void {
    this.fromJson(post.toJson);
  }

  insertComment(comment: CommentModel): void {
    if (comment.parentIdx == this.idx) {
      this.comments.push(comment);
    } else {
      const index = this.comments.findIndex((c) => c.idx == comment.parentIdx);
      this.comments.splice(index + 1, 0, comment);
    }
  }

  /**
   * Create or update current post.
   * @returns PostModel
   */
  async edit(): Promise<PostModel> {
    // create
    const post = await ApiService.instance.postEdit(this.toJson);

    // finish edit work
    this.inEdit = false;

    return post;
  }

  /**
   * Set the post to create mode
   *
   * Initialize for crate mode.
   * 사용자가, 글 작성 버튼 클릭 시, 현재 글 모델을 먼저 초기화 하고, 카테고리 지정 및 글 수정 표시를 한다.
   */
  toCreate(categoryId: string): void {
    this.fromJson({});
    this.categoryId = categoryId;
    this.toEdit(this);
  }

  /**
   * Set the post to edit mode.
   */
  toEdit(post?: PostModel): void {
    if (post) {
      this.copyWith(post);
    }
    this.inEdit = true;
  }

  /**
   * Set the post to view mode
   *
   * It toggles view mode.
   */
  toggleView(): void {
    this.inView = !this.inView;
  }
}

export class CommentModel extends PostRootModel {
  fromJson(map: ResponseData): CommentModel {
    super.fromJson(map);
    return this;
  }

  get toJsonEdit(): MapStringAny {
    const json = this.toJson;
    delete json["files"];
    delete json["beginDate"];
    delete json["endDate"];
    delete json["depth"];
    delete json["url"];
    return json;
  }

  /**
   * Replace current comment model with the input.
   * @param comment comment to replace
   */
  copyWith(comment: CommentModel): void {
    this.fromJson(comment.toJson);
  }
}
