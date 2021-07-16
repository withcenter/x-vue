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

import firebase from "firebase/app";
import "firebase/firestore";
import { MapStringAny } from "@/x-vue/interfaces/interfaces";
import { ChatUserRoomListService } from "./chat.user_room_list.service";

/// You may rewrite your own helper class.
export class ChatRoomService extends ChatBase {
  private static _instance: ChatRoomService;
  public static get instance(): ChatRoomService {
    if (!ChatRoomService._instance) {
      ChatRoomService._instance = new ChatRoomService();
    }
    return ChatRoomService._instance;
  }

  _limit = 30;

  /// upload progress
  progress = 0;

  /// When user scrolls to top to view previous messages, the app fires the scroll event
  /// too much, so it fetches too many batches(pages) at one time.
  /// [_throttle] reduces the scroll event to relax the fetch racing.
  /// [_throttle] is working together with [_throttling]
  /// 1500ms is recommended.
  _throttle = 1500;
  _throttling = false;

  /// When the room information changes or there is new message, then [changes] will be posted.
  ///
  /// This event will be posted when
  /// - init with `null`
  /// - fetching messages(created, modified, updated), with the last chat message.
  ///   When there are messages from Firestore, there might be many message in one fetch, that's why it returns only last message.
  /// - sending a message, with the chat message to be sent.
  /// - cancelling for sending a message. `null` will be passed.
  changes: BehaviorSubject<ChatMessageModel> = BehaviorSubject.create(null);
  //  changes: Subject<ChatMessageModel> = new Subject();

  /// When user scrolls, this event is posted.
  /// If it is scroll up, true will be passed over the parameter.s
  //  scrollChanges: PublishSubject<boolan> = PublishSubject();

  scrollChanges: Subject<boolean> = new Subject();

  /// Whenever global room information chagnes, [globalRoomChanges] will be posted with
  /// the global room document
  ///
  globalRoomChanges: BehaviorSubject<ChatGlobalRoomModel> = BehaviorSubject.create(null);

  // _chatRoomSubscription: Subscription = new Subscription();
  // _currentRoomSubscription: Subscription = new Subscription();
  // _globalRoomSubscription: Subscription = new Subscription();

  _chatRoomSubscription: (() => void) | null = null;
  _currentRoomSubscription: (() => void) | null = null;
  _globalRoomSubscription: (() => void) | null = null;

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

  /// Chat room properties
  get id(): string {
    return this.global?.roomId ?? "";
  }
  get title(): string {
    return this.global?.title;
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
  get createdAt(): firebase.firestore.Timestamp {
    return this.global?.createdAt;
  }

  /// push notification topic name
  get topic(): string {
    return `notifyChat-${this.id}`;
  }

  //   final textController = TextEditingController();
  //   final scrollController = ScrollController();

  //   /// When keyboard(keypad) is open, the app needs to adjust the scroll.
  //   final keyboardVisibilityController = KeyboardVisibilityController();
  //   StreamSubscription keyboardSubscription;

  //   /// Scrolls down to the bottom when,
  //   /// * chat room is loaded (only one time.)
  //   /// * when I chat,
  //   /// * when new chat is coming and the page is scrolled near to bottom. Logically it should not scroll down when the page is scrolled far from the bottom.
  //   /// * when keyboard is open and the page scroll is near to bottom. Locally it should not scroll down when the user is reading message that is far from the bottom.
  //   scrollToBottom({int ms = 100}) {
  //     /// This is needed to safely scroll to bottom after chat messages has been added.
  //     WidgetsBinding.instance.addPostFrameCallback((_) {
  //       if (scrollController.hasClients)
  //         scrollController.animateTo(scrollController.position.maxScrollExtent,
  //             duration: Duration(milliseconds: ms), curve: Curves.ease);
  //     });
  //   }

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
  async enter({
    id = null,
    users = [],
    hatch = true,
    displayName = "",
  }: {
    id?: string | null;
    users?: string[];
    hatch?: boolean;
    displayName?: string;
  }): Promise<void> {
    /// confusing with [this.id], so, it goes as `_id`.
    let _id: string | null = id;
    this._displayName = displayName;

    if (this.loginUserUid == null) {
      throw LOGIN_FIRST;
    }

    if (users == null) users = [];
    // [users] has empty element, remove.
    users.filter((element) => element != null || element != "");
    if (_id != null && users.length > 0) {
      throw BOTH_OF_ID_AND_USERS_HAVE_VALUE;
    }

    if (_id == null && users.length == 0) {
      throw EMPTY_ID_AND_USERS;
    }
    console.log("enter:users", users);
    // Note that, if `id` is set, `users` is ignored. And if both exists, it throws an error.
    if (_id != null) {
      // Enter existing room
      // If permission-denied error happens here,
      // 1. Probably the room does not exists.
      // 2. Or, the login user is not a user of the room.
      //   console.log(this.auth.currentUser.uid);
      console.log("enter: _id", _id);
      this.global = await this.getGlobalRoom(_id);
    } else {
      // Add login user(uid) into room users.
      users.push(this.loginUserUid);
      // Avoid duplicated users.
      users = Array.from(new Set(users));
      if (hatch) {
        console.log("Hatch:: true:: Create New Room::");
        // Always create new room
        await this.___create({ users: users });
      } else {
        console.log("Hatch:: false:: Open Previous New Room::");
        // Create room named based on the user
        // Users array can contain no user or only one user, or even many users.
        // User id must be sorted to generate same room id with same user.
        users.sort();
        const uids = users.join("");
        _id = md5(unescape(encodeURIComponent(uids))).toString();

        console.log("same room: id", _id);
        try {
          // Get global room to see if it exists
          console.log("======================== get room information ======================");
          this.global = await this.getGlobalRoom(_id);

          console.log("this.global", this.global);

          // Base on the security rule the code below will not called even the room doesnt exist
          // because it will throw an error of permission-denied if global-rooms/list/room_id doesnt exist
          // if not exists, create.
          if (this.global == null) {
            console.log("==================== global is null =========================");
            await this.___create({ id: _id, users: users });
          }
        } catch (e) {
          // If room does not exist(or it cannot read), then create.
          // getGlobalRoom(id) will throw error if room doesnt exist yet, and it will fall down to `permission-denied`.
          if (e.code == "permission-denied") {
            // continue to create room
            console.log("============== permission-denied ========================");
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

    this._globalRoomSubscription = this.globalRoomDoc(this.global.roomId).onSnapshot({
      next: (snapshot) => {
        this.global = new ChatGlobalRoomModel().fromSnapshot(snapshot);
        console.log(" ------------> global updated; ");
        console.log(this.global);
        this.globalRoomChanges.next(this.global);
        this;
      },
    });

    // Listening current room document change event (in my room list).
    //
    // This will be notify the listener when chat room title changes, or new users enter, etc.

    if (this._currentRoomSubscription != null) this._currentRoomSubscription();

    this._currentRoomSubscription = this.currentRoom.onSnapshot({
      next: (snapshot) => {
        if (snapshot.exists == false) {
          // User left the room. So the room does not exists.
          return;
        }

        // If the user got a message from a chat room where the user is currently in,
        // then, set `newMessages` to 0.
        const data = new ChatUserRoomModel().fromSnapshot(snapshot);
        if (parseInt(data?.newMessages) > 0 && data?.createdAt != null) {
          this.currentRoom.update({ newMessages: 0 });
        }
      },
    });

    //     // fetch previous chat when user scrolls up
    //     scrollController.addListener(() {
    //       // mark if scrolled up
    //       if (scrollUp) {
    //         scrolledUp = true;
    //       }
    //       // fetch previous messages
    //       if (scrollUp && atTop) {
    //         fetchMessages();
    //       }
    //       scrollChanges.add(scrollUp);
    //     });

    //     // Listen to keyboard
    //     //
    //     // When keyboard opens, scroll to bottom only if needed when user open/hide keyboard.
    //     keyboardSubscription = keyboardVisibilityController.onChange.listen((bool visible) {
    //       if (visible && atBottom) {
    //         scrollToBottom(ms: 10);
    //       }
    //     });
  }

  /// Returns the current room in my room list.
  get currentRoom(): firebase.firestore.DocumentReference {
    return this.myRoom(this.id);
  }

  async ___create({ users = [], id = null }: { users?: string[]; id?: string | null }): Promise<void> {
    console.log("Create Room", "users ====>", users, "id ====>", id);
    console.log("my firebaseUid:: ", this.loginUserUid);

    const info = new ChatGlobalRoomModel().fromJson({
      users: users,
      moderators: [this.loginUserUid],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    let doc: firebase.firestore.DocumentReference;
    console.log("info.data:: ", info.data);
    console.log("ID:: ", id);
    if (id == null) {
      console.log("ID:: is null");
      doc = await this.globalRoomListCol.add(info.data);
    } else {
      console.log("ID:: ", id);
      doc = this.globalRoomListCol.doc(id);
      // Cannot create if the document is already exists.
      // Cannot update if the user is not one of the room user.
      await doc.set(info.data);
    }
    this.global = new ChatGlobalRoomModel().fromSnapshot(await doc.get());

    await this.sendMessage({
      text: ChatProtocol.roomCreated,
      displayName: this.displayName,
    });
  }

  /// Fetch previous messages
  async fetchMessages(): Promise<void> {
    console.log("fetchMessages()");
    console.log("this.noMoreMessage", this.noMoreMessage);
    if (this._throttling || this.noMoreMessage) return;
    this.loading = true;
    this._throttling = true;
    this.page++;
    if (this.page == 1) {
      const ref = this.myRoom(this.global.roomId);
      // console.log('ref: ${ref.path}');
      await ref.set({ newMessages: 0 }, { merge: true });
    }
    /// Get messages for the chat room
    let q: firebase.firestore.Query = this.messagesCol(this.global.roomId)
      .orderBy("createdAt", "desc")
      /// todo make it optional from firestore settings.
      .limit(this._limit); // 몇 개만 가져온다.
    if (this.messages.length) {
      q = q.startAfter([this.messages[0].createdAt]);
    }
    // Listens all the message for update/delete.
    //
    // Note that, when a user chats, [changes] event will be posted twice. one for
    // create(for offline support), the other for modified(real data from firestore).
    // And this may cause the app to render twice and scroll to bottom twice. You may
    // do `debounce` to fix this one.
    this._chatRoomSubscription = q.onSnapshot({
      next: (snapshot) => {
        // console.log('fetchMessage() -> done: _page: $_page');
        // Block loading previous messages for some time.
        this.loading = false;
        // Timer(Duration(milliseconds: _throttle), () => _throttling = false);

        snapshot.docChanges().forEach((documentChange: firebase.firestore.DocumentChange) => {
          // const message = new ChatMessageModel().fromData(documentChange.doc.data(), id: documentChange.doc.id);
          const message = new ChatMessageModel().fromSnapshot(documentChange.doc);
          // message.id = documentChange.doc.id;
          // console.log('type: ${documentChange.type}. ${message['text']}');
          /// 새로 채팅을 하거나, 이전 글을 가져 올 때, 새 채팅(생성)뿐만 아니라, 이전 채팅 글을 가져올 때에도 added 이벤트 발생.
          if (documentChange.type == DocumentChangeType.added) {
            // Two events will be fired on the sender's device.
            // First event has null of FieldValue.serverTimestamp()
            // Only one event will be fired on other user's devices.
            if (message.createdAt == null) {
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
              this.messages.splice(0, 0, message);
            }
            // if it is loading old messages
            // and if it has less messages than the limit
            // check if it is the very first message.
            if (message.createdAt != null) {
              if (snapshot.docs.length < this._limit) {
                if (message.text == ChatProtocol.roomCreated) {
                  this.noMoreMessage = true;
                  // console.log('-----> noMoreMessage: $noMoreMessage');
                }
              }
            }
          } else if (documentChange.type == DocumentChangeType.modified) {
            const i: number = this.messages.findIndex((r) => r.id == message.id);
            if (i > -1) {
              this.messages[i] = message;
            }
          } else if (documentChange.type == DocumentChangeType.removed) {
            const i: number = this.messages.findIndex((r) => r.id == message.id);
            if (i > -1) {
              this.messages.splice(i, 0);
            }
          } else {
            console.log("This is error");
          }
        });
        this.changes.next(this.messages[this.messages.length - 1]);
      },
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
    if (this._chatRoomSubscription != null) {
      this._chatRoomSubscription();
      this._chatRoomSubscription = null;
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
      Object.assign(message, extra);
    }

    if (this.isCreate) {
      console.log("create::");
      // Time that this message(or last message) was created.
      message["createdAt"] = firebase.firestore.FieldValue.serverTimestamp();

      await this.messagesCol(this.global.roomId).add(message);
      // console.log(message);
      message["newMessages"] = firebase.firestore.FieldValue.increment(1); // To increase, it must be an udpate.

      const messages: Promise<void>[] = []; // todo

      /// Just incase there are duplicated UIDs.
      const roomUsers: string[] = Array.from(new Set(this.global.users));
      console.log("roomUsers", roomUsers);

      /// Send a message to all users in the room.
      for (const uid in roomUsers) {
        // console.log(chatUserRoomDoc(uid, info['id']).path);
        console.log("roomUsers[uid]", roomUsers[uid]);
        messages.push(this.userRoomDoc(roomUsers[uid], this.global.roomId).set(message, { merge: true }));
      }
      // console.log('send messages to: ${messages.length}');
      await Promise.all(messages); //Promise.allSettled()
    } else {
      console.log("update::");
      message["updatedAt"] = firebase.firestore.FieldValue.serverTimestamp();
      await this.messagesCol(this.global.roomId).doc(this.isMessageEdit?.id).update(message);
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
    const doc = this.globalRoomDoc(_globalRoom.roomId);
    await doc.update({ users: newUsers });

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
  userRoomDoc(uid: string, roomId: string): firebase.firestore.DocumentReference {
    return this.userRoomListCol(uid).doc(roomId);
  }

  /// Moderator removes a user
  async blockUser(uid: string, userName: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    const users: string[] = _globalRoom.users;
    const i = users.indexOf(uid);
    if (i != -1) users.splice(i, 1);

    // List<String> blocked = info.blocked ?? [];
    _globalRoom.blockedUsers.push(uid);

    /// Update users and blockedUsers first to inform by sending a message.
    await this.globalRoomDoc(this.id).update({ users: _globalRoom.users, blockedUsers: _globalRoom.blockedUsers });

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
    await this.globalRoomDoc(this.id).update({ moderators: moderators });
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

    await this.globalRoomDoc(this.id).update({ moderators: moderators });
    await this.sendMessage({
      text: ChatProtocol.addModerator,
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

    // if the last moderator tries to leave, ask the moderator to add another user to moderator.
    // if (_globalRoom.moderators.contains(loginUserUid) && _globalRoom.moderators.length == 1) {
    //   throw ADD_NEW_MODERATOR_BEFORE_YOU_LEAVE;
    // }

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

    // Update users after removing himself.
    await this.globalRoomDoc(_globalRoom.roomId).update({ users: _globalRoom.users });

    // Delete the room that the user is leaving from. (Not the global room.)
    await this.myRoom(this.id).delete();

    // This will cause `null` for room existence check on currentRoom.snapshot().listener(...);
    this.unsubscribe();
    ChatUserRoomListService.instance.unsubscribeUserRoom(_globalRoom);
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
    await this.globalRoomDoc(_globalRoom.roomId).update({ users: _globalRoom.users });

    await this.sendMessage({
      text: ChatProtocol.kickout,
      displayName: this.displayName,
      extra: { userName: userName },
    });
  }

  /// Returns a room of a user.
  async getMyRoomInfo(uid: string, roomId: string): Promise<ChatUserRoomModel> {
    const snapshot: firebase.firestore.DocumentSnapshot = await this.userRoomDoc(uid, roomId).get();
    if (snapshot.exists) {
      return new ChatUserRoomModel().fromSnapshot(snapshot);
    } else {
      throw ROOM_NOT_EXISTS;
    }
  }

  async updateTitle(title: string): Promise<void> {
    const _globalRoom: ChatGlobalRoomModel = await this.getGlobalRoom(this.id);

    if (_globalRoom.moderators.includes(this.loginUserUid) == false) throw YOU_ARE_NOT_MODERATOR;

    // Update users after removing himself.
    await this.globalRoomDoc(_globalRoom.roomId).update({ title: title });

    await this.sendMessage({
      text: ChatProtocol.titleChanged,
      displayName: this.displayName,
      extra: { newTitle: title },
    });
  }

  editMessage(message: ChatMessageModel): void {
    console.log("editMessage");
    // textController.text = message.text; // todo
    this.isMessageEdit = message;
    this.changes.next(message);
  }

  isMessageOnEdit(message: ChatMessageModel): boolean {
    if (this.isCreate) return false;
    if (!message.isMine) return false;
    return message.id == this.isMessageEdit?.id;
  }

  cancelEdit(): void {
    // textController.text = ''; // todo
    this.isMessageEdit = null;
    this.changes.next(new ChatMessageModel());
  }

  deleteMessage(message: ChatMessageModel): void {
    this.messagesCol(this.id).doc(message.id).delete();
  }

  //   @Deprecated('Use [userRoom]')
  //   Future<ChatUserRoom> get lastMessage => getMyRoomInfo(loginUserUid, id);

  /// Get the document of user's current chat room which has the last message.
  ///
  /// User's private room has all the information of last chat.
  ///
  /// Note that `getMyRoomInfo()` returns `ChatRoomInfo` while `myRoom()`
  /// returns document reference.
  get userRoom(): Promise<ChatUserRoomModel> {
    return this.getMyRoomInfo(this.loginUserUid, this.id);
  }

  //   bool get atBottom {
  //     return scrollController.offset > (scrollController.position.maxScrollExtent - 640);
  //   }

  //   bool get atTop {
  //     return scrollController.position.pixels < 200;
  //   }

  //   /// The [scrolledUp] becomes true once the user scrolls up the chat room screen.
  //   /// Use this to determine if the user has scrolled up the screen.
  //   /// This may be used to control the screen to move downward to bottom when there are images on the messages.
  //   bool scrolledUp = false;
  //   bool get scrollUp {
  //     return scrollController.position.userScrollDirection == ScrollDirection.forward;
  //   }

  //   bool get scrollDown {
  //     return scrollController.position.userScrollDirection == ScrollDirection.reverse;
  //   }

  //   onImageLoadComplete(ChatMessage message) {
  //     // If the user didn't scroll up the screen (which means, it is really very first time entering the chat room),
  //     // then scroll to the bottom on every image load of the message(images).
  //     if (scrolledUp == false) {
  //       scrollToBottom();
  //     }

  //     // If the last message is image and it is shown to screen for the first time (which means, new image has uploaded/come),
  //     // then scroll to the bottom.
  //     // Since the image has rendered once it has screen down, when user scrolls up, it will not interrupt the scroll.
  //     bool lastMessage = message.id == messages.last.id;
  //     if (lastMessage && message.rendered == false) {
  //       message.rendered = true;
  //       ChatRoom.instance.scrollToBottom();
  //     }
  //   }
}
