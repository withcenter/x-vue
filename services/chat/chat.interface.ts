import { isImageUrl } from "./chat.functions";
import { MapStringAny, ResponseData } from "../../interfaces/interfaces";

import firebase from "firebase/app";
import "firebase/firestore";
import { ChatRoomService } from "./chat.room.service";
/// [ChatMessageModel] presents the chat message under
/// `/chat/messages/{roomId}/{messageId}` collection.
///

/// [isImage] returns  if the message is image or not = false.
export class ChatMessageModel {
  id = "";
  createdAt: firebase.firestore.Timestamp = {} as firebase.firestore.Timestamp; //Timestamp
  newUsers: string[] = [];
  senderDisplayName = "";
  senderPhotoURL = "";
  senderUid = "";
  text = "";
  isMine = false;
  isImage = false;
  data: Record<string, unknown> = {};
  extra: Record<string, unknown> = {};

  rendered = false; // for image is complete rendered
  longPress = false;

  get isMovie(): boolean {
    const t = this.text.toLowerCase();
    if (t.startsWith("http") && (t.endsWith(".mov") || t.endsWith(".mp4"))) return true;
    return false;
  }

  canEdit = true;

  fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): ChatMessageModel {
    if (snapshot.exists == false) return new ChatMessageModel();
    const info: firebase.firestore.DocumentData = snapshot.data() as firebase.firestore.DocumentData;
    info["id"] = snapshot.id;
    return this.fromJson(info);
  }

  fromJson(map: ResponseData): ChatMessageModel {
    this.id = map.id;
    this.createdAt = map.createdAt;
    this.newUsers = map.newUsers ?? [];
    this.senderDisplayName = map.senderDisplayName;
    this.senderPhotoURL = map.senderPhotoURL;
    this.senderUid = map.senderUid;
    this.text = map.text;

    this.isMine = map.senderUid == ChatRoomService.instance.loginUserUid;
    this.data = map.data;
    if (map.text != null && isImageUrl(map.text)) {
      this.isImage = true;
    }

    if (map.extra != null) {
      this.extra = map.extra;
    }

    if (map.text.startsWith("ChatProtocol.")) this.canEdit = false;

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
  createdAt: firebase.firestore.Timestamp = {} as firebase.firestore.Timestamp; //Timestamp

  /// [newMessages] has the number of new messages for that room.
  newMessages = "";

  /// [global] is the global room information
  //   global: ChatGlobalRoom = new ChatGlobalRoom();

  isImage = false;

  global = {} as ChatGlobalRoomModel;

  get otherUserPhotoUrl(): string {
    if (!this.global.otherUserId) return "";
    return this.global.usersInfo[this.global.otherUserId].photoUrl;
  }

  get title(): string {
    return this.global.title;
  }

  get otherUserDisplayName(): string {
    if (!this.global.otherUserId) return "";
    return this.global.usersInfo[this.global.otherUserId].displayName;
  }

  // get userRoomTitle(): string {
  //   return this.global.usersInfo[ChatRoomService.instance.loginUserUid].title;
  // }

  fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): ChatUserRoomModel {
    if (snapshot.exists == false) return new ChatUserRoomModel();
    const info: firebase.firestore.DocumentData = snapshot.data() as firebase.firestore.DocumentData;
    info["id"] = snapshot.id;
    return this.fromJson(info);
  }

  fromJson(map: firebase.firestore.DocumentData): ChatUserRoomModel {
    this.id = map.id;
    this.senderUid = map.senderUid;
    this.senderDisplayName = map.senderDisplayName;
    this.senderPhotoURL = map.senderPhotoURL;
    this.users = map.users ?? [];
    this.moderators = map.moderators ?? [];
    this.blockedUsers = map.blockedUsers ?? [];
    this.newUsers = map.newUsers ?? [];
    this.text = map.text;
    this.createdAt = map.createdAt;
    this.newMessages = map.newMessages;
    this.isImage = map.isImage;
    this.global = new ChatGlobalRoomModel().fromJson(map.global);

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
  createdAt: firebase.firestore.Timestamp = {} as firebase.firestore.Timestamp; //Timestamp
  updatedAt: firebase.firestore.Timestamp = {} as firebase.firestore.Timestamp; //Timestamp

  get otherUserId(): string | undefined {
    // If there is no other user.
    return this.users.find((el: string) => el != ChatRoomService.instance.loginUserUid);
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  usersInfo: { [index: string]: any } = {};

  fromJson(map: firebase.firestore.DocumentData): ChatGlobalRoomModel {
    // console.log("ChatGlobalRoomModel::", map);
    if (map == null) return new ChatGlobalRoomModel();
    this.roomId = map.roomId;
    this.title = map.title ?? "";
    this.users = map.users ?? [];
    this.moderators = map.moderators ?? [];
    this.blockedUsers = map.blockedUsers ?? [];
    this.createdAt = map.createdAt;
    this.updatedAt = map.updatedAt;
    this.usersInfo = map.usersInfo;
    return this;
  }

  fromSnapshot(snapshot: firebase.firestore.DocumentSnapshot): ChatGlobalRoomModel {
    if (snapshot.exists == false) return new ChatGlobalRoomModel();
    const info: firebase.firestore.DocumentData = snapshot.data() as firebase.firestore.DocumentData;
    info["roomId"] = snapshot.id;
    return this.fromJson(info);
  }

  get data(): MapStringAny {
    return {
      title: this.title,
      users: this.users,
      moderators: this.moderators,
      blockedUsers: this.blockedUsers,
      createdAt: this.createdAt,
    };
  }
}
