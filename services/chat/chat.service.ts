// // import firebase from "firebase/app";
// // import "firebase/auth";
// // import "firebase/firestore";
// import { getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { ChatRoomService } from "./chat.room.service";
// import { ChatUserRoomListService } from "./chat.user_room_list.service";

// export class ChatService {
//   private static _instance: ChatService;

//   public static get instance(): ChatService {
//     if (!ChatService._instance) {
//       ChatService._instance = new ChatService();
//     }
//     return ChatService._instance;
//   }

//   auth = getAuth(getApp());
//   firestore = getFirestore();
//   room = ChatRoomService.instance;
//   userRoomList = ChatUserRoomListService.instance;
// }
