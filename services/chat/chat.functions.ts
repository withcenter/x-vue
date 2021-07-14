import { ChatRoomService } from "./chat.room";

export function otherUserUid(users: string[]): string | undefined {
  if (users == null) return "";
  return users.find((uid) => {
    uid != ChatRoomService.instance.loginUserUid;
  });
}

export function otherUsersUid(users: string[]): string[] {
  if (users == null) return [];
  return users.filter((uid) => uid != ChatRoomService.instance.loginUserUid); //.toList();
}

export function isImageUrl(t: string): boolean {
  if (t == null || t == "") return false;
  if (t.startsWith("http://") || t.startsWith("https://")) {
    if (
      t.endsWith(".jpg") ||
      t.endsWith(".jpeg") ||
      t.endsWith(".gif") ||
      t.endsWith(".png") ||
      t.includes("f=jpg") ||
      t.includes("f=jpeg") ||
      t.includes("f=gif") ||
      t.includes("f=png")
    ) {
      return true;
    }
  }
  return false;
}
