// import { isImageUrl } from "./chat.functions";
// import { MapStringAny, ResponseData } from "../../interfaces/interfaces";

// // import firebase from "firebase/app";
// // import "firebase/firestore";
// import { ChatRoomService } from "./chat.room.service";
// import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";
// /// [ChatMessageModel] presents the chat message under
// /// `/chat/messages/{roomId}/{messageId}` collection.
// ///

// /// [isImage] returns  if the message is image or not = false.
// export class ChatMessageModel {
//   id = "";
//   createdAt: Timestamp = {} as Timestamp; //Timestamp
//   newUsers: string[] = [];
//   senderDisplayName = "";
//   senderPhotoURL = "";
//   senderUid = "";
//   text = "";
//   isMine = false;
//   isImage = false;
//   data: Record<string, unknown> = {};
//   extra: Record<string, unknown> = {};

//   rendered = false; // for image is complete rendered
//   // longPress = false;

//   get isMovie(): boolean {
//     const t = this.text.toLowerCase();
//     if (
//       t.startsWith("http") &&
//       (t.endsWith(".mov") ||
//         t.endsWith(".mp4") ||
//         t.endsWith(".m4v") ||
//         t.endsWith(".mpg") ||
//         t.endsWith(".mpeg") ||
//         t.endsWith(".mkv") ||
//         t.endsWith(".mov") ||
//         t.endsWith(".wmv") ||
//         t.endsWith(".avi") ||
//         t.endsWith(".webm"))
//     )
//       return true;
//     return false;
//   }

//   get isFile(): boolean {
//     const t = this.text.toLowerCase();
//     if (
//       t.startsWith("http") &&
//       (t.endsWith(".pdf") ||
//         t.endsWith(".mp3") ||
//         t.endsWith(".ogg") ||
//         t.endsWith(".wav") ||
//         t.endsWith(".txt") ||
//         t.endsWith(".htm") ||
//         t.endsWith(".html") ||
//         t.endsWith(".ppt") ||
//         t.endsWith(".pptx") ||
//         t.endsWith(".7z") ||
//         t.endsWith(".rar") ||
//         t.endsWith(".tar") ||
//         t.endsWith(".gz") ||
//         t.endsWith(".zip") ||
//         t.endsWith(".iso") ||
//         t.endsWith(".csv") ||
//         t.endsWith(".xml") ||
//         t.endsWith(".json") ||
//         t.endsWith(".apk") ||
//         t.endsWith(".ttf") ||
//         t.endsWith(".otf") ||
//         t.endsWith(".bmp") ||
//         t.endsWith(".psd") ||
//         t.endsWith(".svg") ||
//         t.endsWith(".doc") ||
//         t.endsWith(".docx") ||
//         t.endsWith(".rtf"))
//     )
//       return true;
//     return false;
//   }

//   canEdit = true;

//   fromSnapshot(snapshot: DocumentSnapshot): ChatMessageModel {
//     if (snapshot.exists() == false) return new ChatMessageModel();
//     const info: DocumentData = snapshot.data() as DocumentData;
//     info["id"] = snapshot.id;
//     return this.fromJson(info);
//   }

//   fromJson(map: ResponseData): ChatMessageModel {
//     this.id = map.id;
//     this.createdAt = map.createdAt;
//     this.newUsers = map.newUsers ?? [];
//     this.senderDisplayName = map.senderDisplayName;
//     this.senderPhotoURL = map.senderPhotoURL;
//     this.senderUid = map.senderUid;
//     this.text = map.text;

//     this.isMine = map.senderUid == ChatRoomService.instance.loginUserUid;
//     this.data = map.data;

//     if (map.text != null && isImageUrl(map.text)) {
//       this.isImage = true;
//     }

//     if (map.extra != null) {
//       this.extra = map.extra;
//     }

//     if (map.text.startsWith("ChatProtocol.")) this.canEdit = false;

//     return this;
//   }
// }

// /// [ChatUserRoom] is for documents of `/chat/rooms/{user-id}` collection.
// export class ChatUserRoomModel {
//   id = "";
//   senderUid = "";
//   senderDisplayName = "";
//   senderPhotoURL = "";
//   text = "";
//   users: string[] = [];
//   moderators: string[] = [];
//   blockedUsers: string[] = [];
//   newUsers: string[] = [];

//   /// [createAt] is the time that last message was sent by a user.
//   /// It will be `FieldValue.serverTimestamp()` when it sends the
//   /// message. And it will `Timestamp` when it read the room information.
//   createdAt: Timestamp = {} as Timestamp; //Timestamp

//   /// [newMessages] has the number of new messages for that room.
//   newMessages = "";

//   isImage = false;

//   /// [global] is the global room information
//   global = new ChatGlobalRoomModel();

//   extra: Record<string, unknown> = {};

//   /// user private title
//   title = "";

//   get getTitle(): string {
//     return this.title || this.global.title;
//   }

//   get otherUserPhotoUrl(): string {
//     if (!this.global.roomId) return "";
//     if (!this.global.otherUserId) return "";
//     return this.global.usersInfo[this.global.otherUserId].photoUrl;
//   }

//   get otherUserDisplayName(): string {
//     if (!this.global.roomId) return "";
//     if (!this.global.otherUserId) return "";
//     return this.global.usersInfo[this.global.otherUserId].displayName;
//   }

//   // get userRoomTitle(): string {
//   //   return this.global.usersInfo[ChatRoomService.instance.loginUserUid].title;
//   // }

//   fromSnapshot(snapshot: DocumentSnapshot): ChatUserRoomModel {
//     if (snapshot.exists() == false) return new ChatUserRoomModel();
//     const info: DocumentData = snapshot.data() as DocumentData;
//     info["id"] = snapshot.id;
//     return this.fromJson(info);
//   }

//   fromJson(map: DocumentData): ChatUserRoomModel {
//     this.id = map.id;
//     this.senderUid = map.senderUid;
//     this.senderDisplayName = map.senderDisplayName;
//     this.senderPhotoURL = map.senderPhotoURL;
//     this.users = map.users ?? [];
//     this.moderators = map.moderators ?? [];
//     this.blockedUsers = map.blockedUsers ?? [];
//     this.newUsers = map.newUsers ?? [];
//     this.text = map.text;
//     this.createdAt = map.createdAt;
//     this.newMessages = map.newMessages;
//     this.isImage = map.isImage;
//     this.title = map.title;
//     this.global = new ChatGlobalRoomModel().fromJson(map.global);

//     if (map.isImage != null && isImageUrl(this.text)) {
//       this.isImage = true;
//     }

//     if (map.extra != null) {
//       this.extra = map.extra;
//     }
//     return this;
//   }
// }

// /// [ChatGloalRoom] is a model (extending [ChatBase]) that represents the chat room under `/chat-global` collection.
// /// All the chat room resides under this collection.
// export class ChatGlobalRoomModel {
//   roomId = "";
//   title = "";
//   users: string[] = [];
//   moderators: string[] = [];
//   blockedUsers: string[] = [];
//   createdAt: Timestamp = {} as Timestamp; //Timestamp
//   updatedAt: Timestamp = {} as Timestamp; //Timestamp

//   get otherUserId(): string | undefined {
//     // If there is no other user.
//     return this.users.find((el: string) => el != ChatRoomService.instance.loginUserUid);
//   }
//   // eslint-disable-next-line  @typescript-eslint/no-explicit-any
//   usersInfo: { [index: string]: any } = {};

//   fromJson(map: DocumentData): ChatGlobalRoomModel {
//     // console.log("ChatGlobalRoomModel::", map);
//     if (map == null) return new ChatGlobalRoomModel();
//     this.roomId = map.roomId;
//     this.title = map.title ?? "";
//     this.users = map.users ?? [];
//     this.moderators = map.moderators ?? [];
//     this.blockedUsers = map.blockedUsers ?? [];
//     this.createdAt = map.createdAt;
//     this.updatedAt = map.updatedAt;
//     this.usersInfo = map.usersInfo;
//     return this;
//   }

//   fromSnapshot(snapshot: DocumentSnapshot): ChatGlobalRoomModel {
//     if (snapshot.exists() == false) return new ChatGlobalRoomModel();
//     const info: DocumentData = snapshot.data() as DocumentData;
//     info["roomId"] = snapshot.id;
//     return this.fromJson(info);
//   }

//   get data(): MapStringAny {
//     return {
//       title: this.title,
//       users: this.users,
//       moderators: this.moderators,
//       blockedUsers: this.blockedUsers,
//       createdAt: this.createdAt,
//     };
//   }
// }
