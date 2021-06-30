import router from "@/router";

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

  alert(title: string, message: string) {
    alert(title + "\n" + message);
  }
  error(e: string) {
    this.alert("Error", e);
  }
  confirm(message: string): boolean {
    return confirm(message);
  }
  toast(title: string, message: string) {
    this.alert(title, message);
  }
  open(path: string) {
    router.push(path);
  }
}
