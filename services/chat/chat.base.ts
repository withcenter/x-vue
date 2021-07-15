import { ChatGlobalRoomModel, ChatMessageModel } from "@/x-vue/services/chat/chat.interface";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ChatProtocol } from "./chat.defines";

export class ChatBase {
  auth = firebase.auth();
  firestore = firebase.firestore();

  get db(): firebase.firestore.Firestore {
    return this.firestore;
  }

  // Returns firebase uid.
  get loginUserUid(): string {
    return this.auth.currentUser == null ? "" : this.auth.currentUser?.uid;
  }

  get isLogin(): boolean {
    return this.auth.currentUser != null;
  }

  page = 0;

  /// [noMoreMessage] becomes true when there is no more old messages to view.
  /// The app should display 'no more message' to user.
  noMoreMessage = false;

  /// Returns the global chat room collection
  get globalRoomListCol(): firebase.firestore.CollectionReference {
    return this.db.collection("chat").doc("global-rooms").collection("list");
  }

  /// Returns login user's room list collection `/chat/my-room-list/{my-uid}` reference.
  get myRoomListCol(): firebase.firestore.CollectionReference {
    return this.userRoomListCol(this.loginUserUid);
  }

  /// Return the collection of messages of the room id.
  messagesCol(roomId: string): firebase.firestore.CollectionReference {
    return this.db.collection("chat").doc("messages").collection(roomId);
  }

  /// Returns my room list collection `/chat/user-rooms/{uid}` reference.
  ///
  userRoomListCol(userId: string): firebase.firestore.CollectionReference {
    return this.db.collection("chat").doc("user-rooms").collection(userId);
  }

  /// Returns my room (that has last message of the room) document
  /// reference.
  userRoomDoc(userId: string, roomId: string): firebase.firestore.DocumentReference {
    return this.userRoomListCol(userId).doc(roomId);
  }

  /// Returns `/chat/global-rooms/list/{roomId}` document reference
  ///
  globalRoomDoc(roomId: string): firebase.firestore.DocumentReference {
    return this.globalRoomListCol.doc(roomId);
  }

  /// Returns document reference of my room (that has last message of the room)
  ///
  /// `/chat/user-rooms/uid/{roomId}`
  myRoom(roomId: string): firebase.firestore.DocumentReference {
    return this.myRoomListCol.doc(roomId);
  }

  text(message: ChatMessageModel): string {
    let text = message.text ?? "";

    if (text == ChatProtocol.roomCreated) {
      text = message.senderDisplayName + "님이 채팅방을 개설했습니다.";
    }
    if (text == ChatProtocol.add) {
      text = message.senderDisplayName + " added " + message.newUsers.join(",");
    }
    if (text == ChatProtocol.kickout) {
      text = message.senderDisplayName + " kicked " + message.data["userName"];
    }
    if (text == ChatProtocol.block) {
      text = message.senderDisplayName + " block  " + message.data["userName"];
    }

    if (text == ChatProtocol.addModerator) {
      text = message.senderDisplayName + " add moderator " + message.data["userName"];
    }
    if (text == ChatProtocol.removeModerator) {
      text = message.senderDisplayName + " remove moderator " + message.data["userName"];
    }

    if (text == ChatProtocol.titleChanged) {
      text = message.senderDisplayName + " change room title ";
      text += message.data["newTitle"] != null ? "to " + message.data["newTitle"] : "";
    }

    if (text == ChatProtocol.enter) {
      // print(message);
      text = "${message.senderDisplayName} invited ${message.newUsers}";
    }
    return text;
  }

  /// Returns the room list info `/chat/global-rooms/list/{roomId}` document.
  ///
  /// If the room does not exists, it returns null.
  /// The return value has `id` as its room id.
  ///
  /// Todo move this method to `ChatRoom`
  async getGlobalRoom(roomId: string): Promise<ChatGlobalRoomModel> {
    const snapshot = await this.globalRoomDoc(roomId).get();
    return new ChatGlobalRoomModel().fromSnapshot(snapshot);
  }
}
