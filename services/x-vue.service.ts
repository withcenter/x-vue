export default class Service {
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
    console.log("Service::init() ,", this.vm);
  }

  /**
   * This uses bootstrap-vue modal.
   *
   * @param title string
   * @param message string
   * @returns void
   */
  alert(title: string, message: string): void {
    return this.vm.$bvModal.msgBoxOk(message, {
      title: title,
      size: "sm",
      buttonSize: "sm",
      okVariant: "success",
      headerClass: "p-2 border-bottom-0",
      footerClass: "p-2 border-top-0",
    });
  }

  error(e: string): void {
    this.alert("Error", e);
  }

  async confirm(
    message: string,
    title?: string,
    okText?: string,
    noText?: string
  ): Promise<boolean> {
    return await this.vm.$bvModal.msgBoxConfirm(message, {
      title: title ?? "",
      size: "sm",
      buttonSize: "sm",
      okVariant: "danger",
      okTitle: okText ?? "yes",
      cancelTitle: noText ?? "no",
      footerClass: "p-2",
      hideHeaderClose: false,
      centered: true,
    });
  }

  open(path: string): void {
    this.vm._router.push(path);
  }

  toast(
    title = "title",
    content = "content",
    placement?: string,
    variant?: string,
    hideCloseButton?: boolean,
    hideDelay?: number,
    append?: boolean
  ): void {
    return this.vm.$bvToast.toast(content, {
      title: title,
      toaster: placement,
      variant: variant,
      noCloseButton: hideCloseButton,
      autoHideDelay: hideDelay ?? 1000,
      append: append,
      solid: true,
    });
  }
}
