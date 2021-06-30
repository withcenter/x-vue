import firebase from "firebase/app";
import "firebase/messaging";
import { ApiService } from "./api.service";

export class FirebaseService {
  private static _instance: FirebaseService;
  private onMessage?: (
    payload: Record<string, Record<string, unknown>>
  ) => void;

  public static get instance(): FirebaseService {
    if (!FirebaseService._instance) {
      FirebaseService._instance = new FirebaseService();
    }

    return FirebaseService._instance;
  }

  public token = "";

  init(
    firebaseConfig: Record<string, unknown>,
    options: {
      onMessage: (payload: Record<string, Record<string, unknown>>) => void;
    }
  ): void {
    firebase.initializeApp(firebaseConfig);
    this.pushMessageInit();
    this.onMessage = options.onMessage;
  }

  pushMessageInit(): void {
    if ("Notification" in window) {
      // const messaging = this.$messaging;
      const messaging = firebase.messaging();

      /** Lets request user whether we need to send the notifications or not */
      // getoken also invoke request notification permission
      // source https://firebase.google.com/docs/cloud-messaging/js/client#access_the_registration_token
      messaging
        .requestPermission()
        .then(() => {
          /** Standard function to get the token */
          messaging
            .getToken()
            .then(async (token) => {
              // console.log("Token", token);
              /** SAVE TOKEN::From here you need to store the TOKEN by AJAX request to your server */
              FirebaseService.instance.token = token;
              await ApiService.instance.saveToken(token, location.hostname);
              // store.commit("onFirebaseMessageTokenSave");
            })
            .catch(function (error) {
              /** If some error happens while fetching the token then handle here */
              // updateUIForPushPermissionRequired();
              console.log("Error while fetching the token " + error);
              // store.commit("onFirebaseMessagePermissionDenied");
            });
        })
        .catch(function (error) {
          /** If user denies then handle something here */
          console.log("Permission denied " + error);
          // store.commit("onFirebaseMessagePermissionDenied");
        });

      messaging.onMessage((payload) => {
        console.log("messaging.onMessage::payload", payload);
        // const notification = payload.notification;
        // console.log("notification", notification);
        // const data = payload.data ? payload.data : {};
        // console.log("data", data);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.onMessage!(payload);
      });
    }
  }
}
