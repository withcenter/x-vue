import { ChatGlobalRoomModel, ChatMessageModel } from "@/x-vue/services/chat/chat.interface";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  DocumentReference,
  FirebaseFirestore,
  getFirestore,
  getDoc,
  doc,
} from "firebase/firestore";
import { t } from "../functions";

import { ChatProtocol } from "./chat.defines";

export class ChatBase {
  auth = getAuth(getApp());
  firestore = getFirestore();

  public constructor() {
    // console.log("ChatBase");
  }

  get db(): FirebaseFirestore {
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
  get globalRoomListCol(): CollectionReference {
    return collection(this.db, "chat/global-rooms/list");
  }

  /// Returns login user's room list collection `/chat/my-room-list/{my-uid}` reference.
  get myRoomListCol(): CollectionReference {
    return this.userRoomListCol(this.loginUserUid);
  }

  /// Return the collection of messages of the room id.
  messagesCol(roomId: string): CollectionReference {
    return collection(this.db, "chat/messages/" + roomId);
  }

  /// Returns my room list collection `/chat/user-rooms/{uid}` reference.
  ///
  userRoomListCol(userId: string): CollectionReference {
    return collection(this.db, "chat/user-rooms/" + userId);
  }

  /// Returns my room (that has last message of the room) document
  /// reference.
  userRoomDoc(userId: string, roomId: string): DocumentReference {
    // return this.userRoomListCol(userId).doc(roomId);
    return doc(this.userRoomListCol(userId), roomId);
  }

  /// Returns `/chat/global-rooms/list/{roomId}` document reference
  ///
  globalRoomDoc(roomId: string): DocumentReference | null {
    // return this.globalRoomListCol.doc(roomId);
    if (!roomId) return null;
    console.log("globalRoomDoc::", roomId);
    return doc(this.globalRoomListCol, roomId);
  }

  /// Returns document reference of my room (that has last message of the room)
  ///
  /// `/chat/user-rooms/uid/{roomId}`
  myRoom(roomId: string): DocumentReference {
    // return this.myRoomListCol.doc(roomId);
    return doc(this.myRoomListCol, roomId);
  }

  text(message: ChatMessageModel, prefixName: false): string {
    let text = message.text ?? "";

    if (text.startsWith("ChatProtocol.")) {
      let newText = "";
      if (prefixName) newText = message.senderDisplayName + " ";

      if (text == ChatProtocol.roomCreated) {
        newText += t("chat_room_create");
      }
      if (text == ChatProtocol.leave) {
        newText += t("chat_room_leave");
      }
      if (text == ChatProtocol.add) {
        newText += t("added") + " " + message.newUsers.join(",");
      }
      if (text == ChatProtocol.kickout) {
        newText += t("kicked") + " " + message.data["userName"];
      }
      if (text == ChatProtocol.block) {
        newText += t("blocked") + " " + message.data["userName"];
      }

      if (text == ChatProtocol.addModerator) {
        newText += t("add_moderator") + " " + message.data["userName"];
      }
      if (text == ChatProtocol.removeModerator) {
        newText += t("remove_moderator") + " " + message.data["userName"];
      }

      if (text == ChatProtocol.titleChanged) {
        newText += t("chat_room_title_changed");
        newText += message.extra["newTitle"] != null ? " " + t("to") + " " + message.extra["newTitle"] : "";
      }
      if (text == ChatProtocol.enter) {
        newText += t("chat_room_enter") + " " + message.newUsers;
      }
      text = newText;
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
    const _globalRoomDoc = this.globalRoomDoc(roomId);
    if (!_globalRoomDoc) return new ChatGlobalRoomModel();
    const snapshot = await getDoc(_globalRoomDoc);
    return new ChatGlobalRoomModel().fromSnapshot(snapshot);
  }
}
