import { ChatBase } from "./chat.base";

/// You may rewrite your own helper class.
export class ChatRoom extends ChatBase {
  private static _instance: ChatRoom;
  public static get instance(): ChatRoom {
    if (!ChatRoom._instance) {
      ChatRoom._instance = new ChatRoom();
    }
    return ChatRoom._instance;
  }
}
