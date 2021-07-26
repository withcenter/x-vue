/// Chat room list helper class
///
/// This is a completely independent helper class to help to list login user's room list.

import { ChatBase } from "./chat.base";
import { ChatGlobalRoomModel, ChatUserRoomModel } from "./chat.interface";

import { BehaviorSubject } from "rxjs";

import firebase from "firebase/app";
import "firebase/firestore";
import { DocumentChangeType } from "./chat.defines";

/// You may rewrite your own helper class.
export class ChatUserRoomListService extends ChatBase {
  private static _instance: ChatUserRoomListService;
  public static get instance(): ChatUserRoomListService {
    if (!ChatUserRoomListService._instance) {
      ChatUserRoomListService._instance = new ChatUserRoomListService();
    }
    return ChatUserRoomListService._instance;
  }

  private constructor() {
    super();
    // console.log("ChatUserRoomListService");
    this.init();
  }

  init(): void {
    this.auth.onAuthStateChanged((user) => {
      console.log("onAuthStateChanged::", user);
      if (user == null) {
        this._unsubscribe();
      } else {
        this._reset({});
        this._listenRoomList();
      }
    });
  }

  //   // Function __render;  // needed?

  //   /// This event is posted with a room info when
  //   /// - gets all the room list of user when it first run. The last room will be passed over.
  //   /// - and when there is new chat, user room will be modified, so, this event will be passed over again with the room that has chagned.
  //   /// - When global room information changes. it will pass the user room of the global room.
  //   ///
  //   /// To get the whole list of room info, use [rooms].
  changes: BehaviorSubject<ChatUserRoomModel> = new BehaviorSubject(new ChatUserRoomModel());

  _myRoomListSubscription: (() => void) | null = null;

  _roomSubscriptions: { [index: string]: () => void } = {} as { [index: string]: () => void };

  /// Login user's whole room list including room id.
  rooms: ChatUserRoomModel[] = [];
  _order = "createdAt";

  newMessages = 0;

  _reset({ order = "" }: { order?: string }): void {
    if (order != "") {
      this._order = order;
    }
    this.newMessages = 0;
    this.rooms = [];
    if (this._myRoomListSubscription != null) {
      this._myRoomListSubscription();
      this._myRoomListSubscription = null;
    }
  }

  /// Listen to global room updates.
  ///
  /// Listen for;
  /// - title changes,
  /// - users array changes,
  /// - and other properties change.
  _listenRoomList(): void {
    // console.log("_listenRoomList::");
    this._myRoomListSubscription = this.myRoomListCol.orderBy(this._order, "asc").onSnapshot({
      next: (snapshot) => {
        // console.log("_listenRoomList::snapshot::", snapshot.docs);
        snapshot.docChanges().forEach((documentChange: firebase.firestore.DocumentChange) => {
          const roomInfo = new ChatUserRoomModel().fromSnapshot(documentChange.doc);
          // console.log(roomInfo?.newMessages);

          if (documentChange.type == DocumentChangeType.added) {
            this.rooms.unshift(roomInfo);

            /// When room list is retreived for the first, it will be added to listener.
            /// This is where [changes] event happens many times when the app listens to room list.
            this._roomSubscriptions[roomInfo.id] = this.globalRoomDoc(roomInfo.id).onSnapshot({
              next: (snapshot) => {
                const found: number = this.rooms.findIndex((r) => r.id == roomInfo.id);
                this.rooms[found].global = new ChatGlobalRoomModel().fromSnapshot(snapshot);
                // console.log('global room has changed. ${rooms[found]}');
                this.changes.next(this.rooms[found]);
              },
            });
          } else if (documentChange.type == DocumentChangeType.modified) {
            // console.log("_listenRoomList", DocumentChangeType.modified, roomInfo);
            const found: number = this.rooms.findIndex((r) => r.id == roomInfo.id);
            // If global room information exists, copy it to updated object to
            // maintain global room information.
            roomInfo.global = this.rooms[found].global;
            this.rooms.splice(found, 1, roomInfo);
          } else if (documentChange.type == DocumentChangeType.removed) {
            const i: number = this.rooms.findIndex((r) => r.id == roomInfo.id);
            if (i > -1) {
              // remove from rooms list
              this.rooms.splice(i, 1);
            }
          } else {
            console.log("This is error");
          }
        });

        this.newMessages = 0;
        this.rooms.forEach((roomInfo) => {
          console.log(roomInfo.newMessages);
          this.newMessages += parseInt(roomInfo.newMessages);
        });

        console.log(this.newMessages);

        /// post event with last room
        const re =
          snapshot.docChanges().length > 0
            ? new ChatUserRoomModel().fromSnapshot(
                snapshot.docChanges()[snapshot.docChanges().length - 1].doc as firebase.firestore.DocumentSnapshot
              )
            : new ChatUserRoomModel();

        // console.log("ROOMS::: ", this.rooms);
        this.changes.next(re);
      },
    });
  }

  _unsubscribe(): void {
    if (this._myRoomListSubscription != null) this._myRoomListSubscription();
    if (Object.keys(this._roomSubscriptions).length) {
      for (const key in this._roomSubscriptions) {
        this._roomSubscriptions[key]();
      }
      this._roomSubscriptions = {};
    }
    this.newMessages = 0;
  }

  unsubscribeUserRoom(room: ChatGlobalRoomModel): void {
    console.log("unsubscribeUserRoom::", room);
    if (this._roomSubscriptions.isEmpty) return;
    if (this._roomSubscriptions[room.roomId] == null) return;
    // console.log(this._roomSubscriptions[room.roomId]);
    this._roomSubscriptions[room.roomId]();
    delete this._roomSubscriptions[room.roomId];
  }
}
