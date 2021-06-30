import router from "@/router";
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
interface ComponentServiceOptions {
  alert?: (title: string, message: string) => Promise<void>;
  confirmToast?: (options: ConfirmToast) => void;
  toast?: (title: string, message: string) => void;
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
  toast(title: string, message: string): void {
    if (this.options.toast) {
      this.options.toast(title, message);
    } else {
      this.alert(title, message);
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
}
