import { isImageUrl } from "./chat.functions";
import { ResponseData } from "../../interfaces/interfaces";

import firebase from "firebase/app";
import "firebase/firestore";
// import { ChatBase } from "./chat.base";
import { ChatService } from "./chat.service";
/// [ChatMessageModel] presents the chat message under
/// `/chat/messages/{roomId}/{messageId}` collection.
///

/// [isImage] returns  if the message is image or not = false.
export class ChatMessageModel {
  id = "";
  createdAt = ""; //Timestamp
  newUsers: string[] = [];
  senderDisplayName = "";
  senderPhotoURL = "";
  senderUid = "";
  text = "";
  isMine = false;
  isImage = false;
  data: Record<string, unknown> = {};
  rendered = false;

  get isMovie(): boolean {
    const t = this.text.toLowerCase();
    if (t.startsWith("http") && (t.endsWith(".mov") || t.endsWith(".mp4"))) return true;
    return false;
  }

  fromJson(map: ResponseData): ChatMessageModel {
    this.id = map.id;
    this.createdAt = map.createdAt;
    this.newUsers = map.newUsers;
    this.senderDisplayName = map.senderDisplayName;
    this.senderPhotoURL = map.senderPhotoURL;
    this.senderUid = map.senderUid;
    this.text = map.text;

    // this.isMine = map.isMine == ChatRoom.instance.loginUserUid; // @todo make this work

    this.isMine = map.isMine;
    this.isImage = map.isImage;
    this.data = map.data;
    if (map.text != null && isImageUrl(map.text)) {
      this.isImage = true;
    }

    return this;
  }
}

/// [ChatUserRoom] is for documents of `/chat/rooms/{user-id}` collection.
export class ChatUserRoomModel {
  id = "";
  senderUid = "";
  senderDisplayName = "";
  senderPhotoURL = "";
  text = "";
  users: string[] = [];
  moderators: string[] = [];
  blockedUsers: string[] = [];
  newUsers: string[] = [];

  /// [createAt] is the time that last message was sent by a user.
  /// It will be `FieldValue.serverTimestamp()` when it sends the
  /// message. And it will `Timestamp` when it read the room information.
  createdAt = ""; //Timestamp

  /// [newMessages] has the number of new messages for that room.
  newMessages = "";

  /// [global] is the global room information
  //   global: ChatGlobalRoom = new ChatGlobalRoom();

  isImage = false;

  fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): ChatUserRoomModel | null {
    if (snapshot.exists == false) return null;
    const info: firebase.firestore.DocumentData = snapshot.data() as firebase.firestore.DocumentData;
    info["id"] = snapshot.id;
    return this.fromJson(info);
  }

  fromJson(map: firebase.firestore.DocumentData): ChatUserRoomModel {
    this.id = map.id;
    this.senderUid = map.senderUid;
    this.senderDisplayName = map.senderDisplayName;
    this.senderPhotoURL = map.senderPhotoURL;
    this.users = map.users;
    this.moderators = map.moderators;
    this.blockedUsers = map.blockedUsers;
    this.newUsers = map.newUsers;
    this.text = map.text;
    this.createdAt = map.createdAt;
    this.newMessages = map.newMessages;
    this.isImage = map.isImage;

    if (map.isImage != null && isImageUrl(this.text)) {
      this.isImage = true;
    }
    return this;
  }
}

/// [ChatGloalRoom] is a model (extending [ChatBase]) that represents the chat room under `/chat-global` collection.
/// All the chat room resides under this collection.
export class ChatGlobalRoomModel {
  roomId = "";
  title = "";
  users: string[] = [];
  moderators: string[] = [];
  blockedUsers: string[] = [];
  createdAt = "";
  updatedAt = "";

  get otherUserId(): string | undefined {
    // If there is no other user.
    return this.users.find((el: string) => el != ChatService.instance.auth.currentUser?.uid);
  }

  fromJson(map: firebase.firestore.DocumentData): ChatGlobalRoomModel {
    // if (map == null) return new ChatGlobalRoomModel();
    this.roomId = map.id;
    this.title = map.title;
    this.users = map.users;
    this.moderators = map.moderators;
    this.blockedUsers = map.blockedUsers;
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;
    return this;
  }

  fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): ChatGlobalRoomModel | null {
    if (snapshot.exists == false) return null;
    const info: firebase.firestore.DocumentData = snapshot.data() as firebase.firestore.DocumentData;
    info["id"] = snapshot.id;
    return this.fromJson(info);
  }
}
