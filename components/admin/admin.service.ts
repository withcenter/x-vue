export default class AdminService {
  private constructor() {
    console.log("AdminService::construcotr");
  }
  private static _instance: AdminService;
  public static get instance(): AdminService {
    if (!AdminService._instance) {
      AdminService._instance = new AdminService();
    }
    return AdminService._instance;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  vm: any;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  init(options: { vm: any }): void {
    this.vm = options.vm;
    // console.log("XHelper::init", this.vm);
  }

  alert(msg: string) {
    alert(msg);
  }
  error(e: string) {
    this.alert(e);
  }
  confirm(message: string): boolean {
    return this.confirm(message);
  }
  open(path: string) {
    this.vm._router.push(path);
  }
}
