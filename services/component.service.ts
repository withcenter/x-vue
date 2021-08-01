import router from "@/router";
import store from "@/store";
import { PostModel } from "../interfaces/forum.interface";
import { translate } from "./functions";
export interface ConfirmToast {
  title: string;
  message: string;
  yesCallback: () => void;
  noCallback: () => void;
  placement?: string;
  variant?: string;
  hideDelay?: number;
  append?: boolean;
}

export interface PromptToast {
  title: string;
  message: string;
  okCallback: (input: string) => void;
  cancelCallback?: () => void;
  placement?: string;
  variant?: string;
  hideDelay?: number;
  append?: boolean;
}

export interface Toast {
  title: string;
  message: string;
  clickCallback?: () => void;
  closeCallback?: () => void;
  placement?: string;
  variant?: string;
  hideDelay?: number;
  append?: boolean;
}

export enum PLACEMENT {
  TOP_RIGHT = "b-toaster-top-right",
  TOP_LEFT = "b-toaster-top-left",
  TOP_CENTER = "b-toaster-top-center",
  TOP_FULL = "b-toaster-top-full",
  BOTTOM_RIGHT = "b-toaster-bottom-right",
  BOTTOM_LEFT = "b-toaster-bottom-left",
  BOTTOM_CENTER = "b-toaster-bottom-center",
  BOTTOM_FULL = "b-toaster-bottom-full",
}

interface ComponentServiceOptions {
  alert?: (title: string, message: string) => Promise<void>;
  confirmToast?: (options: ConfirmToast) => void;
  toast?: (options: Toast) => void;
  confirm?: (title: string, message: string) => Promise<boolean | null>;
  promptToast?: (options: PromptToast) => void;
}
export default class ComponentService {
  // private constructor() {
  //   console.log("ComponentService::construcotr");
  // }
  private static _instance: ComponentService;
  public static get instance(): ComponentService {
    if (!ComponentService._instance) {
      ComponentService._instance = new ComponentService();
    }
    return ComponentService._instance;
  }

  options: ComponentServiceOptions = {} as ComponentServiceOptions;

  get loggedIn(): boolean {
    return store.state.user.loggedIn;
  }
  get notLoggedIn(): boolean {
    return !this.loggedIn;
  }

  init(options: ComponentServiceOptions): void {
    this.options = options;
  }

  alert(title: string, message: string): Promise<void> {
    if (this.options.alert) {
      return this.options.alert(translate(title), translate(message));
    } else {
      alert(translate(title) + "\n" + translate(message));
      return Promise.resolve();
    }
  }
  error(e: string): Promise<void> {
    return this.alert("error", e);
  }
  confirm(title: string, message: string): Promise<boolean | null> {
    if (this.options.confirm) {
      return this.options.confirm(title, message);
    } else {
      const re = confirm(title + "\n" + message);
      if (re) return Promise.resolve(true);
      else return Promise.resolve(false);
    }
  }
  /**
   * Show a toast
   * @param options Toast options
   * @returns void
   * 
   * @example
        ComponentService.instance.toast({
          title: notification?.title || "",
          message: notification?.body || "",
          placement: PLACEMENT.BOTTOM_RIGHT,
          hideDelay: 10000,
          clickCallback: () => {
            const path = store.state.router.currentRoute.path;
            if (path == url || (data["type"] === "chat" && path == "/chat-message")) {
              store.commit("contentViewKey");
            }
            store.state.router.push(url);
          },
        });
   *
   */
  async toast(options: Toast): Promise<void> {
    if (this.options.toast) {
      return this.options.toast(options);
    } else {
      const re = await this.confirm(options.title, options.message);
      if (re) {
        if (options.clickCallback) options.clickCallback;
      } else {
        if (options.closeCallback) options.closeCallback;
      }
    }
  }
  async confirmToast(options: ConfirmToast): Promise<void> {
    if (this.options.confirmToast) {
      return this.options.confirmToast(options);
    } else {
      const re = await this.confirm(options.title, options.message);
      if (re) options.yesCallback();
      else options.noCallback();
    }
  }

  async promptToast(options: PromptToast): Promise<void> {
    if (this.options.promptToast) {
      return this.options.promptToast(options);
    } else {
      const re = prompt(options.title, options.message);
      if (re) options.okCallback(re);
      else {
        if (options.cancelCallback) options.cancelCallback();
      }
    }
  }
  open(path: string): void {
    router.push(path);
  }

  tempIdx = 0;
  temporaryPost(): PostModel {
    this.tempIdx++;
    const file = { url: "", thumbnailurl: "" };
    const user = { nicknameOrName: `user-${this.tempIdx}` };
    let categoryId = "";
    if (this.tempIdx % 10 == 0) {
      file.url = "https://via.placeholder.com/600/92c952";
      categoryId = "apple";
    } else if (this.tempIdx % 10 == 1) {
      file.url = "https://via.placeholder.com/300x400/000/fff.png?text=Yo, Narrow";
      categoryId = "banana";
    } else if (this.tempIdx % 10 == 2) {
      file.url = "https://via.placeholder.com/600/51aa97";
      categoryId = "cherry";
    } else if (this.tempIdx % 10 == 3) {
      file.url = "https://via.placeholder.com/600x300/500.png?text=Yo, Wide";
      categoryId = "dragon";
    } else if (this.tempIdx % 10 == 4) {
      file.url = "https://via.placeholder.com/200x200/808.png?text=No. 4";
      categoryId = "apple";
    } else if (this.tempIdx % 10 == 5) {
      file.url = "https://via.placeholder.com/200x200/393.png?text=No. 5";
      categoryId = "banana";
    } else if (this.tempIdx % 10 == 6) {
      file.url = "https://via.placeholder.com/300x300/770.png?text=No. 6";
      categoryId = "cherry";
    } else if (this.tempIdx % 10 == 7) {
      file.url = "https://via.placeholder.com/300x300/D00.png?text=No. 7";
      categoryId = "dragon";
    } else if (this.tempIdx % 10 == 8) {
      file.url = "https://via.placeholder.com/300x300/0D0.png?text=No. 8";
      categoryId = "apple";
    } else if (this.tempIdx % 10 == 9) {
      file.url = "https://via.placeholder.com/300x300/00D.png?text=No. 3";
      categoryId = "banana";
    }
    file.thumbnailurl = file.url;

    let title =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    let content =
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.";
    if (this.tempIdx % 2 == 1) {
      title =
        "보배를 군영과 것은 그러므로 두손을 뿐이다. 살 때까지 앞이 얼마나 대중을 있다. 투명하되 얼음이 대한 아름다우냐? 그들은 희망의 작고 따뜻한 황금시대다.";
      content =
        "보배를 군영과 것은 그러므로 두손을 뿐이다. 살 때까지 앞이 얼마나 대중을 있다. 투명하되 얼음이 대한 아름다우냐? 그들은 희망의 작고 따뜻한 황금시대다. 영원히 인생을 예수는 풍부하게 행복스럽고 뜨고, 이상을 것이다. 남는 너의 피에 이상은 심장의 그들은 넣는 뜨고, 청춘의 쓸쓸하랴? 앞이 그와 예수는 듣는다. 더운지라 위하여서, 노년에게서 돋고, 바로 풀이 것이다. 그림자는 따뜻한 속에 실현에 인도하겠다는 꽃이 교향악이다. 길지 것이 무엇을 뜨거운지라, 아니다";
    }

    return new PostModel().fromJson({
      idx: this.tempIdx,
      relativeUrl: "#",
      title: `${this.tempIdx} - ${title}`,
      content: `${content}.. \n\n${this.tempIdx}.`,
      files: [file],
      user: user,
      categoryId: categoryId,
      shortDate: "01-01-01",
      noOfComments: this.tempIdx % 4,
    });
  }
}
