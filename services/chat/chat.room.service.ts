import { ChatBase } from "./chat.base";
import {
  BOTH_OF_ID_AND_USERS_HAVE_VALUE,
  ChatProtocol,
  CHAT_DISPLAY_NAME_IS_EMPTY,
  DocumentChangeType,
  EMPTY_ID_AND_USERS,
  LOGIN_FIRST,
  MODERATOR_NOT_EXISTS_IN_USERS,
  ONE_OF_USERS_ARE_BLOCKED,
  ROOM_NOT_EXISTS,
  USER_NOT_EXIST_IN_ROOM,
  YOU_ARE_NOT_MODERATOR,
} from "./chat.defines";

import { ChatGlobalRoomModel, ChatMessageModel, ChatUserRoomModel } from "./chat.interface";

import md5 from "crypto-js/md5";
import { BehaviorSubject, Subject } from "rxjs";

// import firebase from "firebase/app";
// import "firebase/firestore";
import { MapStringAny } from "@/x-vue/interfaces/interfaces";
import { ChatUserRoomListService } from "./chat.user_room_list.service";
import Vue from "vue";
import {
  Timestamp,
  onSnapshot,
  DocumentData,
  DocumentSnapshot,
  DocumentReference,
  serverTimestamp,
  updateDoc,
  addDoc,
  doc,
  setDoc,
  getDoc,
  Query,
  orderBy,
  query,
  limit,
  startAfter,
  DocumentChange,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/messaging";

export interface ChatRoomEnter {
  id?: string | null;
  users?: string[];
  hatch?: boolean;
  displayName: string;
}

/// You may rewrite your own helper class.
export class ChatRoomService extends ChatBase {
  private static _instance: ChatRoomService;
  public static get instance(): ChatRoomService {
    if (!ChatRoomService._instance) {
      ChatRoomService._instance = new ChatRoomService();
    }
    return ChatRoomService._instance;
  }

  /// This hold the message list(container) HTML element id.
  /// This is needed for listening scroll events.
  messageListId = "chat-room-message-list";
  _limit = 30;

  /// upload progress
  progress = 0;

  /// When user scrolls to top to view previous messages, the app fires the scroll event
  /// too much, so it fetches too many batches(pages) at one time.
  /// [_throttle] reduces the scroll event to relax the fetch racing.
  /// Note, that it is expected to have multiple fetches from remote database by one scroll slide,
  /// For instance, when you slide on `Apple mouse` to scroll up, it looks like the scroll event
  /// lasts more than a seconds. In this case, after throttle time has passed, there will be another
  /// fetch.
  throttle = 500;

  /// When the room information changes or there is new message, then [changes] will be posted.
  ///
  /// This event will be posted when
  /// - init with `null`
  /// - fetching messages(created, modified, updated), with the last chat message.
  ///   When there are messages from Firestore, there might be many message in one fetch, that's why it returns only last message.
  /// - sending a message, with the chat message to be sent.
  /// - cancelling for sending a message. `null` will be passed.
  changes: BehaviorSubject<ChatMessageModel> = new BehaviorSubject(new ChatMessageModel());

  /// When user scrolls, this event is posted.
  /// If it is scroll up, true will be passed over the parameter.

  scrollChanges: Subject<boolean> = new Subject();

  /// Whenever global room information chagnes, [globalRoomChanges] will be posted with
  /// the global room document
  ///
  globalRoomChanges: BehaviorSubject<ChatGlobalRoomModel> = new BehaviorSubject(new ChatGlobalRoomModel());

  _chatRoomSubscriptions: Array<Unsubscribe | null> = [];

  // _chatRoomSubscription: Unsubscribe | null = null;
  _currentRoomSubscription: Unsubscribe | null = null;
  _globalRoomSubscription: Unsubscribe | null = null;

  //   /// Loaded the chat messages of current chat room.
  messages: ChatMessageModel[] = [];

  //   /// [loading] becomes true while the app is fetching more messages.
  //   /// The app should display loader while it is fetching.
  loading = false;

  /// Current room's global room document.
  ///
  /// Use this to dipplay title or other information of the current room.
  /// When `/chat/global-rooms/list/{roomId}` changes, it will be updated and calls render handler.
  global: ChatGlobalRoomModel = {} as ChatGlobalRoomModel;
  current: ChatUserRoomModel = {} as ChatUserRoomModel;

  /// Chat room properties
  get id(): string {
    return this.global?.roomId ?? "";
  }

  get getTitle(): string {
    return this.current.title || this.global.title;
  }

  /// The [users] holds the firebase uid(s) of the global.users which will be loaded
  /// when user enters chat room and the global room information has fetched.
  /// The [users] will be available immediately after chat room entering.
  get users(): string[] {
    return this.global?.users;
  }
  get moderators(): string[] {
    return this.global?.moderators;
  }
  get blockedUsers(): string[] {
    return this.global?.blockedUsers;
  }
  get createdAt(): Timestamp {
    return this.global?.createdAt;
  }

  /// push notification topic name
  get topic(): string {
    return `notifyChat-${this.id}`;
  }

  get otherUserId(): string {
    return this.global.otherUserId ?? "";
  }

  get isModerator(): boolean {
    return this.moderators.includes(this.loginUserUid);
  }

  textInput = "";

  //   /// When keyboard(keypad) is open, the app needs to adjust the scroll.
  //   final keyboardVisibilityController = KeyboardVisibilityController();
  //   StreamSubscription keyboardSubscription;

  //   /// Scrolls down to the bottom when,
  //   /// * chat room is loaded (only one time.)
  //   /// * when I chat,
  //   /// * when new chat is coming and the page is scrolled near to bottom. Logically it should not scroll down when the page is scrolled far from the bottom.
  //   /// * when keyboard is open and the page scroll is near to bottom. Locally it should not scroll down when the user is reading message that is far from the bottom.
  scrollToBottom(): void {
    /// This is needed to safely scroll to bottom after chat messages has been added.
    Vue.nextTick(() => {
      if (!this.messages.length) return;

      const el = document.getElementById(this.messageListId);
      if (!el) return;
      // el.scrollTop = el.scrollHeight;

      el.scrollTo(el.scrollTop, el.scrollHeight);
      // const el: Element = document.getElementById(this.messageListId) as Element;
      // el.scrollTop = el.scrollHeight || 0;

      // console.log("scroll to bottom", this.messages[this.messages.length - 1].id);
      // const elmnt = document.getElementById(`${this.messages[this.messages.length - 1].id}`);
      // elmnt?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    });
  }

  isMessageEdit: ChatMessageModel | null = null;
  get isCreate(): boolean {
    return this.isMessageEdit == null;
  }

  _displayName: string | null = null;

  get displayName(): string {
    return this._displayName || this.loginUserUid;
  }

  /// Enter chat room
  ///
  /// If [hatch] is set to true, then it will always create new room even if you are talking to
  /// same person. The room id is auto generated by adding new document.
  /// If [hatch] is set to false, then it will do md5() with the ID(s) of room users, so, it
  /// does not generate new room id.
  ///
  /// Null or empty string in [users] will be wiped out.
  ///
  /// Whenever global room information changes, it is updated on [global].
  async enter({ id = null, users = [], hatch = false, displayName }: ChatRoomEnter): Promise<void> {
    /// confusing with [this.id], so, it goes as `_id`.
    let _id: string | null = id;
    this._displayName = displayName;

    if (this.loginUserUid == null) {
      throw LOGIN_FIRST;
    }

    // firebase ids
    if (users == null) users = [];
    // [users] has empty element, remove.
    users.filter((element) => element != null || element != "");
    if (_id != null && users.length > 0) {
      throw BOTH_OF_ID_AND_USERS_HAVE_VALUE;
    }

    if (_id == null && users.length == 0) {
      throw EMPTY_ID_AND_USERS;
    }

    // Note that, if `id` is set, `users` is ignored. And if both exists, it throws an error.
    if (_id != null) {
      // Enter existing room
      // If permission-denied error happens here,
      // 1. Probably the room does not exists.
      // 2. Or, the login user is not a user of the room.
      //   console.log(this.auth.currentUser.uid);
      // console.log("enter: _id", _id);
      this.global = await this.getGlobalRoom(_id);
    } else {
      // console.log("enter:users::", users);
      // Add login user(uid) into room users.
      users.push(this.loginUserUid);
      // Avoid duplicated users.
      users = Array.from(new Set(users));
      if (hatch) {
        // console.log("Hatch:: true:: Create New Room::");
        // Always create new room
        await this.___create({ users: users });
      } else {
        // console.log("Hatch:: false:: Open Previous New Room::");
        // Create room named based on the user
        // Users array can contain no user or only one user, or even many users.
        // User id must be sorted to generate same room id with same user.
        users.sort();
        const uids = users.join("");
        _id = md5(unescape(encodeURIComponent(uids))).toString();

        // console.log("same room: id", _id);
        try {
          // Get global room to see if it exists
          // console.log("======================== get room information ======================");
          this.global = await this.getGlobalRoom(_id);

          // console.log("this.global", this.global);

          // Base on the security rule the code below will not called even the room doesnt exist
          // because it will throw an error of permission-denied if global-rooms/list/room_id doesnt exist
          // if not exists, create.
          if (this.global == null) {
            // console.log("==================== global is null =========================");
            await this.___create({ id: _id, users: users });
          }
        } catch (e) {
          // If room does not exist(or it cannot read), then create.
          // getGlobalRoom(id) will throw error if room doesnt exist yet, and it will fall down to `permission-denied`.
          if (e.code == "permission-denied") {
            // continue to create room
            // console.log("============== permission-denied ========================");
            await this.___create({ id: _id, users: users });
          } else {
            throw e;
          }
        }
      }
    }

    // fetch latest messages
    this.fetchMessages();

    // Listening current global room for changes and update.
    if (this._globalRoomSubscription != null) this._globalRoomSubscription();
    console.log("this._globalRoomSubscription = onSnapshot(::");
    const _globalRoomDoc = this.globalRoomDoc(this.global.roomId);
    if (_globalRoomDoc) {
      this._globalRoomSubscription = onSnapshot(_globalRoomDoc, {
        next: (snapshot) => {
          this.global = new ChatGlobalRoomModel().fromSnapshot(snapshot);
          // console.log(" ------------> global updated; ");
          // console.log(this.global);
          this.globalRoomChanges.next(this.global);
          this;
        },
      });
    }

    // Listening current room document change event (in my room list).
    //
    // This will be notify the listener when chat room title changes, or new users enter, etc.

    if (this._currentRoomSubscription != null) this._currentRoomSubscription();

    this._currentRoomSubscription = onSnapshot(this.currentRoom, {
      next: (snapshot) => {
        if (snapshot.exists() == false) {
          // User left the room. So the room does not exists.
          return;
        }

        // If the user got a message from a chat room where the user is currently in,
        // then, set `newMessages` to 0.
        this.current = new ChatUserRoomModel().fromSnapshot(snapshot as DocumentSnapshot<DocumentData>);
        if (parseInt(this.current?.newMessages) > 0 && this.current?.createdAt != null) {
          updateDoc(this.currentRoom, { newMessages: 0 });
        }
      },
    });

    // // Listen to keyboard
    // //
    // // When keyboard opens, scroll to bottom only if needed when user open/hide keyboard.
    // keyboardSubscription = keyboardVisibilityController.onChange.listen((bool visible) {
    //   if (visible && atBottom) {
    //     scrollToBottom(ms: 10);
    //   }
    // });
  }

  /**
   * Message list box scroll even handler.
   *
   * When user scroll up the message list box to see previous messages, then this will
   * handle the loading.
   *
   * @returns void
   */
  scrollEventHandler(): void {
    if (this.noMoreMessage) return;
    const el = document.getElementById(this.messageListId);
    if (!el) return;
    const top = el.scrollTop;
    if (this.scrollUp(top) && top < 200) {
      this.fetchMessages();
    }
  }

  oldTop = 0;
  // isScrollTop = false;
  scrollUp(top: number): boolean {
    // console.log("scrollUp::", this.oldTop, top);
    if (this.oldTop > top) {
      // console.log("↑");
      this.oldTop = top;
      this.scrolledUp = true;
      // this.isScrollTop = true;
      return true;
    } else {
      // console.log("↓");
      this.oldTop = top;
      // this.isScrollTop = false;
      return false;
    }
  }

  /// Returns the current room in my room list.
  get currentRoom(): DocumentReference {
    return this.myRoom(this.id);
  }

  async ___create({ users = [], id = null }: { users?: string[]; id?: string | null }): Promise<void> {
    // console.log("Create Room", "users ====>", users, "id ====>", id);
    // console.log("my firebaseUid:: ", this.loginUserUid);

    const info = new ChatGlobalRoomModel().fromJson({
      users: users,
      moderators: [this.loginUserUid],
      createdAt: serverTimestamp(),
    });

    let _doc: DocumentReference;
    // console.log("info.data:: ", info.data);
    // console.log("ID:: ", id);
    if (id == null) {
      // console.log("ID:: is null");
      _doc = await addDoc(this.globalRoomListCol, info.data);
    } else {
      // console.log("ID:: ", id);
      _doc = doc(this.globalRoomListCol, id);
      // Cannot create if the document is already exists.
      // Cannot update if the user is not one of the room user.
      await setDoc(_doc, info.data);
    }
    this.global = new ChatGlobalRoomModel().fromSnapshot(await getDoc(_doc));

    await this.sendMessage({
      text: ChatProtocol.roomCreated,
      displayName: this.displayName,
    });
  }

  /// Fetch previous messages
  async fetchMessages(): Promise<void> {
    // console.log("fetchMessages()");
    // console.log("this.noMoreMessage", this.noMoreMessage);
    // console.log(this.loading, this.noMoreMessage);

    // console.log("fetchMessages()::", !(this.loading  || this.noMoreMessage));
    if (this.loading || this.noMoreMessage) return;
    this.loading = true;

    this.page++;
    // console.log("------ pageNo;", this.page);

    // console.log("this.page++;", this.page);
    if (this.page == 1) {
      const ref = this.myRoom(this.global.roomId);
      // console.log('ref: ${ref.path}');
      await setDoc(ref, { newMessages: 0 }, { merge: true });
    }
    /// Get messages for the chat room
    // let q: firebase.firestore.Query = this.messagesCol(this.global.roomId)
    // .orderBy("createdAt", "desc")
    let q: Query = this.messagesCol(this.global.roomId);
    // q = orderBy("createdAt", "desc")
    q = query(q, orderBy("createdAt", "desc"), limit(this._limit));
    /// todo make it optional from firestore settings.
    if (this.messages.length) {
      q = query(q, startAfter(this.messages[0].createdAt));
      // console.log("this.messages.length", this.messages.length, this.messages[0]);
      // q = q.startAfter(this.messages[0].createdAt);
    }
    // Listens all the message for update/delete.

    // Note that, when a user chats, [changes] event will be posted twice. one for
    // create(for offline support), the other for modified(real data from firestore).
    // And this may cause the app to render twice and scroll to bottom twice. You may
    // do `debounce` to fix this one.

    /// Listen NOT for the newly created or coming from DB, but for listening updates and deletes.
    this._chatRoomSubscriptions[this.page] = onSnapshot(q, (snapshot) => {
      // console.log('fetchMessage() -> done: _page: $_page');

      snapshot.docChanges().forEach((documentChange: DocumentChange) => {
        // const message = new ChatMessageModel().fromData(documentChange.doc.data(), id: documentChange.doc.id);
        const message = new ChatMessageModel().fromSnapshot(documentChange.doc);
        // message.id = documentChange.doc.id;
        // console.log('type: ${documentChange.type}. ${message['text']}');
        /// 새로 채팅을 하거나, 이전 글을 가져 올 때, 새 채팅(생성)뿐만 아니라, 이전 채팅 글을 가져올 때에도 added 이벤트 발생.
        // console.log("documentChange.type::", documentChange.type);
        if (documentChange.type == DocumentChangeType.added) {
          // Two events will be fired on the sender's device.
          // First event has null on `createdAt` which should have FieldValue.serverTimestamp().
          //  - This is because the message cached on locally before saving into the remote database.
          // Then, there will be another event with the same msssage that has proper value of `createdAt` which comes from the remote database.
          // Note, Only one event will be fired on other user's devices since there is no cache for the other user.
          if (message.createdAt == null) {
            // console.log("sendMessage");
            this.messages.push(message);
          }
          /// if it's new message, add at bottom.
          else if (
            this.messages.length > 0 &&
            this.messages[0].createdAt != null &&
            message.createdAt.seconds > this.messages[0].createdAt.seconds
          ) {
            this.messages.push(message);
          } else {
            // if it's old message, add on top.
            // console.log("oldMessage arrived. adding on top. pageNo; ", this.page);
            this.messages.splice(0, 0, message);
            // this.messages.unshift(message);
          }
          // if it is loading old messages
          // and if it has less messages than the limit
          // check if it is the very first message.
          if (message.createdAt != null) {
            if (snapshot.docs.length < this._limit) {
              if (message.text == ChatProtocol.roomCreated) {
                this.noMoreMessage = true;
              }
            }
          }
        } else if (documentChange.type == DocumentChangeType.modified) {
          console.log("modified", message);
          const i: number = this.messages.findIndex((r) => r.id == message.id);
          if (i > -1) {
            this.messages.splice(i, 1, message);
          }
        } else if (documentChange.type == DocumentChangeType.removed) {
          console.log("remove", message);
          const i: number = this.messages.findIndex((r) => r.id == message.id);
          if (i > -1) {
            this.messages.splice(i, 1);
          }
        } else {
          console.log("This is error");
        }
      });

      setTimeout(() => {
        // After `throttle` time has passed, set the `loading` to false. Which means,
        // it can fetch next batch of message again.
        this.loading = false;

        // console.log("------ pageNo;", this.page, " has finished;");

        const el = document.getElementById(this.messageListId);
        if (!el) return;
        const top = el.scrollTop;
        if (top == 0 && !this.noMoreMessage) {
          el.scrollTo(0, 100);
        }
      }, this.throttle);

      // console.log("this.changes.next:::::======", this.messages[this.messages.length - 1]);
      this.changes.next(this.messages[this.messages.length - 1]);
    });
  }

  /// Unsubscribe room event listeners
  ///
  /// Especially when unit testing, multiple users log in/out at the same time
  /// and permission erros will happen here by listening other user's document.
  ///
  ///
  /// Must be set to null since these are checked if null before re-subscriptoin.
  ///
  /// When a user enters a chat room, the app will listen,
  /// 1. the chat message colltion,
  /// 2. the current room information,
  /// 3. the global room infromation
  /// And right before the user leave the room, it should be unsubscribed.
  unsubscribe(): void {
    if (this._chatRoomSubscriptions.length) {
      this._chatRoomSubscriptions.forEach((chatRoomSubscription, i) => {
        if (chatRoomSubscription != null) {
          chatRoomSubscription();
          this._chatRoomSubscriptions[i] = null;
        }
      });
    }
    if (this._currentRoomSubscription != null) {
      this._currentRoomSubscription();
      this._currentRoomSubscription = null;
    }
    if (this._globalRoomSubscription != null) {
      this._globalRoomSubscription();
      this._globalRoomSubscription = null;
    }

    // if (this.keyboardSubscription != null) {
    //   this.keyboardSubscription.cancel();
    //   this.keyboardSubscription = null;
    // }

    this.resetRoom();
  }

  resetRoom(): void {
    this.global = new ChatGlobalRoomModel();
    this.messages = [];
    this.page = 0;
    this.noMoreMessage = false;
    this.scrolledUp = false;
    this.oldTop = 0;
  }

  /// Send chat message to the users in the room
  ///
  /// [displayName] is the name that the sender will use. The default is
  /// `ff.user.displayName`.
  ///
  /// [photoURL] is the sender's photo url. Default is `ff.user.photoURL`.
  ///
  /// [type] is the type of the message. It can be `image` or `text` if string only.
  async sendMessage({
    text,
    displayName,
    extra = {},
    photoURL = "",
  }: {
    text: string;
    displayName: string;
    extra?: MapStringAny;
    photoURL?: string;
  }): Promise<MapStringAny> {
    if (displayName == null || displayName.trim() == "") {
      throw CHAT_DISPLAY_NAME_IS_EMPTY;
    }

    const message: MapStringAny = {
      senderUid: this.loginUserUid,
      senderDisplayName: displayName,
      senderPhotoURL: photoURL,
      text: text,

      // Make [newUsers] empty string for re-setting(removing) from previous
      // message.
      newUsers: [] as string[],
    };

    if (extra != null) {
      // Object.assign(message, extra);

      message["extra"] = extra;
    }

    if (this.isCreate) {
      // console.log("create::sendMessage");
      // Time that this message(or last message) was created.
      message["createdAt"] = serverTimestamp();

      // await this.messagesCol(this.global.roomId).add(message);
      await addDoc(this.messagesCol(this.global.roomId), message);
      // console.log(message);
      message["newMessages"] = increment(1); // To increase, it must be an udpate.

      const messages: Promise<void>[] = []; // todo

      /// Just incase there are duplicated UIDs.
      // console.log("this.global.users::", this.global.users);
      const roomUsers: string[] = Array.from(new Set(this.global.users));
      // console.log("roomUsers", roomUsers);

      /// Send a message to all users in the room.
      for (const uid in roomUsers) {
        // console.log(chatUserRoomDoc(uid, info['id']).path);
        // console.log("roomUsers[uid]", roomUsers[uid]);
        messages.push(setDoc(this.userRoomDoc(roomUsers[uid], this.global.roomId), message, { merge: true }));
      }
      // console.log('send messages to: ${messages.length}');
      await Promise.all(messages); //Promise.allSettled()
    } else {
      // console.log("update::sendMessage");
      message["updatedAt"] = serverTimestamp();
      await updateDoc(doc(this.messagesCol(this.global.roomId), this.isMessageEdit?.id), message);
      this.isMessageEdit = null;
    }

    return message;
  }

  /// Add users to chat room
  ///
  /// Once user(s) has added, `who added who` messages will be delivered to all
  /// of room users. `newUsers` array will have the names of newly added users.
  ///
  /// [users] is a Map of user uid and user name. like `{uidA: 'nameA', ...}`
  ///
  /// See readme
  ///
  /// todo before adding user, check if the user is in `blockedUsers` property and if yes, throw a special error code.
  /// Todo move this method to `ChatRoom`
  /// todo use arrayUnion on Firestore
  async addUser(users: Record<string, string>): Promise<void> {
    /// Get latest info from server.
    /// There might be a chance that somehow `info['users']` is not upto date.
    /// So, it is safe to get room info from server.
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    if (_globalRoom.blockedUsers != null && _globalRoom.blockedUsers.length > 0) {
      for (const blockedUid in _globalRoom.blockedUsers) {
        if (users.keys.includes(blockedUid)) {
          throw ONE_OF_USERS_ARE_BLOCKED;
        }
      }
    }

    let newUsers: string[] = _globalRoom.users.concat(users.keys);
    newUsers = Array.from(new Set(newUsers));

    /// Update users first and then send chat messages to all users.
    /// In this way, newly entered/added user(s) will have the room in the my-room-list

    /// Update users array with added user.
    await updateDoc(this.globalRoomDoc(_globalRoom.roomId) as DocumentReference<DocumentData>, { users: newUsers });

    /// Update last message of room users.
    await this.sendMessage({
      text: ChatProtocol.add,
      displayName: this.displayName,
      extra: {
        newUsers: newUsers,
      },
    });
  }

  /// Returns a user's room (that has last message of the room) document
  /// reference.
  userRoomDoc(uid: string, roomId: string): DocumentReference {
    return doc(this.userRoomListCol(uid), roomId);
  }

  /// Moderator removes a user
  async blockUser(uid: string, userName: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    const users: string[] = _globalRoom.users;
    const i = users.indexOf(uid);
    if (i != -1) users.splice(i, 1);

    _globalRoom.blockedUsers.push(uid);

    /// Update users and blockedUsers first to inform by sending a message.
    await updateDoc(this.globalRoomDoc(this.id) as DocumentReference<DocumentData>, {
      users: _globalRoom.users,
      blockedUsers: _globalRoom.blockedUsers,
    });

    /// Inform all users.
    await this.sendMessage({
      text: ChatProtocol.block,
      displayName: this.displayName,
      extra: { userName: userName },
    });
  }

  /// Add a moderator
  ///
  /// Only moderator can add a user to moderator.
  /// The user must be included in `users` array.
  ///
  async addModerator(uid: string, userName?: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);
    const moderators: string[] = _globalRoom.moderators;
    if (moderators.includes(this.loginUserUid) == false) throw YOU_ARE_NOT_MODERATOR;
    if (_globalRoom.users.includes(uid) == false) throw MODERATOR_NOT_EXISTS_IN_USERS;
    moderators.push(uid);
    await updateDoc(this.globalRoomDoc(this.id) as DocumentReference<DocumentData>, { moderators: moderators });
    await this.sendMessage({
      text: ChatProtocol.addModerator,
      displayName: this.displayName,
      extra: { userName: userName || uid },
    });
  }

  /// Remove a moderator.
  ///
  /// Only moderator can remove a moderator.
  async removeModerator(uid: string, userName?: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    const moderators: string[] = _globalRoom.moderators;
    const i = moderators.indexOf(uid);
    if (i != -1) moderators.splice(i, 1);

    await updateDoc(this.globalRoomDoc(this.id) as DocumentReference<DocumentData>, { moderators: moderators });
    await this.sendMessage({
      text: ChatProtocol.removeModerator,
      displayName: this.displayName,
      extra: { userName: userName || uid },
    });
  }

  /// User go out of a room. The user is no longer part of the room
  ///
  /// Once a user has left, the user will not be able to update last message of
  /// room users. So, before leave, it should update 'leave' last message of room users.
  ///
  /// For moderator to block user, see [chatBlockUser]
  ///
  /// [roomId] is the chat room id.
  /// [uid] is the user to be kicked out by moderator.
  /// [userName] is the userName to leave or to be kicked out. and it is required.
  /// [text] is the text to send to all users.
  ///
  /// This method throws permission error when a user try to remove another user.
  /// But admin can remove other users.
  ///
  ///
  /// then move the room information from /chat/info/room-list to /chat/info/deleted-room-list.
  async leave(): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    // If there is only one user left (which is himself), then he can leave without setting other user to admin.

    // Update last message of room users that the user is leaving.
    await this.sendMessage({
      text: ChatProtocol.leave,
      displayName: this.displayName,
      extra: { userName: this.loginUserUid },
    });

    /// remove the login user from [_globalRoom.users] users array.
    const i = _globalRoom.users.indexOf(this.loginUserUid);
    if (i != -1) _globalRoom.users.splice(i, 1);

    // A moderator leaves the room?
    if (_globalRoom.moderators.includes(this.loginUserUid)) {
      // There is no more moderator for the room? but there are more than 2 uesrs?
      if (_globalRoom.moderators.length == 1 && _globalRoom.users.length >= 2) {
        // Then, set the first one (not the moderator) to moderator.
        await this.addModerator(_globalRoom.users[0]);
      }
      // Then, remove himself from moderator.
      await this.removeModerator(this.loginUserUid);
    }

    // Update users after removing loginUserUid himself.
    await updateDoc(this.globalRoomDoc(_globalRoom.roomId) as DocumentReference<DocumentData>, {
      users: _globalRoom.users,
    });

    // unsubscribe first on room for both message and room list to avoid [Error in snapshot listener]
    // This will cause `null` for room existence check on currentRoom.snapshot().listener(...);
    this.unsubscribe();

    // unsubscribe to room list before deleting the room to avoid  [Error in snapshot listener]
    ChatUserRoomListService.instance.unsubscribeUserRoom(_globalRoom);

    // Delete the room that the user is leaving from. (Not the global room.)
    await deleteDoc(this.myRoom(_globalRoom.roomId));
  }

  /// Kicks a user out of the room.
  ///
  /// The user who was kicked can enter room again by himself. Somebody must add
  /// him.
  /// Only moderator can kick a user out.
  async kickout(uid: string, userName: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    if (_globalRoom.moderators.includes(this.loginUserUid) == false) throw YOU_ARE_NOT_MODERATOR;
    if (_globalRoom.users.includes(uid) == false) throw USER_NOT_EXIST_IN_ROOM;

    const i = _globalRoom.users.indexOf(uid);
    if (i != -1) _globalRoom.users.splice(i, 1);

    // Update users after removing himself.
    await updateDoc(this.globalRoomDoc(_globalRoom.roomId) as DocumentReference<DocumentData>, {
      users: _globalRoom.users,
    });

    await this.sendMessage({
      text: ChatProtocol.kickout,
      displayName: this.displayName,
      extra: { userName: userName },
    });
  }

  /// Returns a room of a user.
  async getMyRoomInfo(uid: string, roomId: string): Promise<ChatUserRoomModel> {
    const snapshot: DocumentSnapshot = await getDoc(this.userRoomDoc(uid, roomId));
    if (snapshot.exists()) {
      return new ChatUserRoomModel().fromSnapshot(snapshot);
    } else {
      throw ROOM_NOT_EXISTS;
    }
  }

  async updateTitle(title: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    // if (_globalRoom.moderators.includes(this.loginUserUid) == false) throw YOU_ARE_NOT_MODERATOR;

    if (_globalRoom.moderators.includes(this.loginUserUid)) {
      // update global room title
      await updateDoc(this.globalRoomDoc(_globalRoom.roomId) as DocumentReference<DocumentData>, { title: title });
      // notify all users
      await this.sendMessage({
        text: ChatProtocol.titleChanged,
        displayName: this.displayName,
        extra: { newTitle: title },
      });
    }
    // update own room title
    setDoc(this.userRoomDoc(this.loginUserUid, this.global.roomId), { title: title }, { merge: true });
  }

  async updateGlobalRoomUsersInfo(info: Record<string, unknown>): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    // if (_globalRoom.moderators.includes(this.loginUserUid) == false) throw YOU_ARE_NOT_MODERATOR;

    // Update users photoProfile silently
    await setDoc(
      this.globalRoomDoc(_globalRoom.roomId) as DocumentReference<DocumentData>,
      { usersInfo: info },
      { merge: true }
    );
  }

  editMessage(message: ChatMessageModel): void {
    this.textInput = message.text;
    this.isMessageEdit = message;
    this.changes.next(message);
  }

  isMessageOnEdit(message: ChatMessageModel): boolean {
    if (this.isCreate) return false;
    if (!message.isMine) return false;
    return message.id == this.isMessageEdit?.id;
  }

  cancelEdit(): void {
    this.textInput = "";
    this.isMessageEdit = null;
    this.changes.next(new ChatMessageModel());
  }

  async deleteMessage(message: ChatMessageModel): Promise<void> {
    return deleteDoc(doc(this.messagesCol(this.id), message.id));
  }

  /// Get the document of user's current chat room which has the last message.
  ///
  /// User's private room has all the information of last chat.
  ///
  /// Note that `getMyRoomInfo()` returns `ChatRoomInfo` while `myRoom()`
  /// returns document reference.
  get userRoom(): Promise<ChatUserRoomModel> {
    return this.getMyRoomInfo(this.loginUserUid, this.id);
  }

  get atBottom(): boolean {
    const el = document.getElementById(this.messageListId);
    if (!el) return false;
    const height = el.scrollTop;
    const sh = el.scrollHeight;
    return sh - height < 540;
  }

  get atTop(): boolean {
    const el = document.getElementById(this.messageListId);
    if (!el) return false;
    const height = el.scrollTop;
    return height < 200;
  }

  /// The [scrolledUp] becomes true once the user scrolls up the chat room screen.
  scrolledUp = false;
  onImageLoadComplete(message: ChatMessageModel): void {
    // console.log("onImageLoadComplete::", message);
    message.rendered = true;
    this.onMediaLoaded(message);
  }

  onVideoloaded(m: ChatMessageModel): void {
    // console.log("onVideoloaded::", m);
    this.onMediaLoaded(m);
  }

  onMediaLoaded(message: ChatMessageModel): void {
    // If the user didn't scroll up the screen (which means, it is really very first time entering the chat room),
    // then scroll to the bottom on every image load of the message(images).
    // console.log("onImageLoadComplete::this.scrolledUp", this.scrolledUp);
    if (this.scrolledUp == false) {
      this.scrollToBottom();
    }

    // If the last message is image and it is shown to screen for the first time (which means, new image has uploaded/come),
    // then scroll to the bottom.
    // Since the image has rendered once it has screen down, when user scrolls up, it will not interrupt the scroll.
    if (!message.id || !this.messages.length || this.messages[this.messages.length - 1].id) return;
    const lastMessage: boolean = message.id == this.messages[this.messages.length - 1].id;
    if (lastMessage) {
      this.scrollToBottom();
    }
  }
}
