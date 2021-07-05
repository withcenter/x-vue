import router from "@/router";
import { PostModel } from "../interfaces/forum.interface";
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

  init(options: ComponentServiceOptions): void {
    this.options = options;
  }

  alert(title: string, message: string): Promise<void> {
    if (this.options.alert) {
      return this.options.alert(title, message);
    } else {
      alert(title + "\n" + message);
      return Promise.resolve();
    }
  }
  error(e: string): Promise<void> {
    return this.alert("Error", e);
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
  open(path: string): void {
    router.push(path);
  }

  tempIdx = 0;
  temporaryPost(): PostModel {
    this.tempIdx++;
    return new PostModel().fromJson({
      idx: this.tempIdx,
      relativeUrl: "#",
      title: `${this.tempIdx} - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      content: `Ut enim ad minim veniam,\nquis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n${this.tempIdx}.`,
      files: [
        {
          url: "https://symbols.getvecta.com/stencil_82/45_google-icon.d8d982f8a1.svg",
        },
      ],
    });
  }
}
