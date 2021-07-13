import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export class ChatService {
  private static _instance: ChatService;

  public static get instance(): ChatService {
    if (!ChatService._instance) {
      ChatService._instance = new ChatService();
    }
    return ChatService._instance;
  }

  auth = firebase.auth();
  firestore = firebase.firestore();
}
