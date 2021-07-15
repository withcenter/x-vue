// chat service
export const ROOM_NOT_EXISTS = "ROOM_NOT_EXISTS";
export const MODERATOR_NOT_EXISTS_IN_USERS = "MODERATOR_NOT_EXISTS_IN_USERS";
export const YOU_ARE_NOT_MODERATOR = "YOU_ARE_NOT_MODERATOR";
// export const ADD_NEW_MODERATOR_BEFORE_YOU_LEAVE = "ADD_NEW_MODERATOR_BEFORE_YOU_LEAVE";
export const ONE_OF_USERS_ARE_BLOCKED = "ONE_OF_USERS_ARE_BLOCKED";
export const USER_NOT_EXIST_IN_ROOM = "USER_NOT_EXIST_IN_ROOM";
export const CHAT_DISPLAY_NAME_IS_EMPTY = "CHAT_DISPLAY_NAME_IS_EMPTY";

export const BOTH_OF_ID_AND_USERS_HAVE_VALUE = "One of id or users must be null; Both cannot have value.";
export const EMPTY_ID_AND_USERS = "Id or users must have value; Both cannot be null or empty.";

export const LOGIN_FIRST = "Login first";

export enum ChatProtocol {
  enter = "ChatProtocol.enter",
  add = "ChatProtocol.add",
  leave = "ChatProtocol.leave",
  kickout = "ChatProtocol.kickout",
  block = "ChatProtocol.block",
  roomCreated = "ChatProtocol.roomCreated",
  titleChanged = "ChatProtocol.titleChanged",

  addModerator = "ChatProtocol.addModerator",
  removeModerator = "ChatProtocol.removeModerator",
}

export enum DocumentChangeType {
  added = "added",
  removed = "removed",
  modified = "modified",
}
