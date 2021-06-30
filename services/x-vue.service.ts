export default class Service {
  // private constructor() {
  //   console.log("Service::construcotr");
  // }
  private static _instance: Service;
  public static get instance(): Service {
    if (!Service._instance) {
      Service._instance = new Service();
    }
    return Service._instance;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  vm: any;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  init(options: { vm: any }): void {
    this.vm = options.vm;
    // console.log("XHelper::init", this.vm);
  }

  alert(title: string, message: string): void {
    alert(title + "\n" + message);
  }
  error(e: string): void {
    this.alert("Error", e);
  }
  confirm(message: string): boolean {
    return this.confirm(message);
  }
  open(path: string): void {
    this.vm._router.push(path);
  }
}
