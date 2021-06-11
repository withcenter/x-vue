import firebase from "firebase/app";
import "firebase/messaging";
import { ApiService } from "./api.service";
import store from "@/store";

export class FirebaseService {
  private static _instance: FirebaseService;

  // private constructor() {}

  public static get instance(): FirebaseService {
    if (!FirebaseService._instance) {
      FirebaseService._instance = new FirebaseService();
    }

    return FirebaseService._instance;
  }

  public token = "";

  init(firebaseConfig: Record<string, unknown>): void {
    firebase.initializeApp(firebaseConfig);
    this.pushMessageInit();
  }

  pushMessageInit(): void {
    console.log("messagingInit(): void {");
    if ("Notification" in window) {
      console.log("Notification in::; ", "Notification" in window);
      // const messaging = this.$messaging;
      const messaging = firebase.messaging();

      /** Lets request user whether we need to send the notifications or not */
      // getoken also invoke request notification permission
      // source https://firebase.google.com/docs/cloud-messaging/js/client#access_the_registration_token
      Notification.requestPermission()
        .then(() => {
          /** Standard function to get the token */
          messaging
            .getToken()
            .then((token) => {
              console.log("Token", token);
              /** SAVE TOKEN::From here you need to store the TOKEN by AJAX request to your server */
              FirebaseService.instance.token = token;
              ApiService.instance.saveToken(token, location.hostname);
            })
            .catch(function (error) {
              /** If some error happens while fetching the token then handle here */
              // updateUIForPushPermissionRequired();
              console.log("Error while fetching the token " + error);
            });
        })
        .catch(function (error) {
          /** If user denies then handle something here */
          console.log("Permission denied " + error);
        });

      messaging.onMessage((payload) => {
        console.log("messaging.onMessage::payload", payload);
        // const notification = payload.notification;
        // console.log("notification", notification);
        // const data = payload.data ? payload.data : {};
        // console.log("data", data);
        store.commit("onMessage", payload);
      });
    }
  }
}
