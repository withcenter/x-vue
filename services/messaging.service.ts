import { getMessaging, getToken, MessagePayload, onMessage } from "firebase/messaging";
import { ApiService } from "./api.service";

export class MessagingService {
  private static _instance: MessagingService;
  private onMessage?: (payload: MessagePayload) => void;

  public static get instance(): MessagingService {
    if (!MessagingService._instance) {
      MessagingService._instance = new MessagingService();
    }
    return MessagingService._instance;
  }

  public token = "";

  init(options: { onMessage: (payload: MessagePayload) => void }): void {
    this.pushMessageInit();
    this.onMessage = options.onMessage;
  }

  pushMessageInit(): void {
    if ("Notification" in window) {
      // const messaging = this.$messaging;
      const messaging = getMessaging();

      /** Lets request user whether we need to send the notifications or not */
      // getoken also invoke request notification permission
      // source https://firebase.google.com/docs/cloud-messaging/js/client#access_the_registration_token

      getToken(messaging)
        .then(async (token) => {
          // console.log("Token", token);
          /** SAVE TOKEN::From here you need to store the TOKEN by AJAX request to your server */
          MessagingService.instance.token = token;
          console.log("messaging.service.ts::getToken() => token;", token);
          await ApiService.instance.saveToken(token, location.hostname);
          // store.commit("onFirebaseMessageTokenSave");
        })
        .catch(function (error) {
          /** If some error happens while fetching the token then handle here */
          // updateUIForPushPermissionRequired();
          console.log("Error while fetching the token " + error);
          // store.commit("onFirebaseMessagePermissionDenied");
        });

      onMessage(messaging, (payload) => {
        console.log("messaging.onMessage::payload", payload);
        // const notification = payload.notification;
        // console.log("notification", notification);
        // const data = payload.data ? payload.data : {};
        // console.log("data", data);
        // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //
        if (this.onMessage) this.onMessage(payload);
      });
    }
  }
}
