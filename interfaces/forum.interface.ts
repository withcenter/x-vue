import { ApiService } from "../services/api.service";
import { FileModel, MapStringAny, ResponseData, UserModel } from "./interfaces";

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
  comments?: number;
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

  get searchOptions(): PostSearchRequest {
    return {
      categoryId: this.categoryId,
      page: this.page,
      limit: this.limit,
    };
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

  /// Since the [forum.post] is the ....
  toEdit(post: PostModel): void {
    this.post = post;
    post.toEdit();
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

  rootIdx = 0;

  url = "";
  path = "";
  relativeUrl = "";

  title = "";
  categoryId = "";
  categoryIdx = 0;

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

  get isDeleted(): boolean {
    return this.deletedAt > 0;
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

  updateVoteCount(map: ResponseData): void {
    this.N = map.N;
    this.Y = map.Y;
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
    this.toEdit();
  }

  /**
   * Set the post to edit mode.
   */
  toEdit() {
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
}
