<template>
  <section>
    <router-link
      class="d-flex align-items-center"
      v-for="room in roomsList.rooms"
      :key="room.id"
      :to="{ path: 'chat-message', query: { roomId: room.id } }"
    >
      <b-avatar class="avatar mr-2 mb-2" :src="room.otherUserPhotoUrl"></b-avatar>
      <div>
        <div class="bold">
          {{ room.getTitle || room.otherUserDisplayName || getUserName(room) }}
          <span v-if="room.newMessages">({{ room.newMessages }})</span>
        </div>
        <div>
          {{ room.senderUid == roomsList.loginUserUid ? t("you") : room.senderDisplayName }}:
          {{ roomsList.text(room) }}
        </div>
      </div>
    </router-link>
  </section>
</template>

<script lang="ts">
import { ChatUserRoomListService } from "@/x-vue/services/chat/chat.user_room_list.service";
import { Vue, Component } from "vue-property-decorator";

import { translate } from "@/x-vue/services/functions";
import { UserModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { ChatUserRoomModel } from "@/x-vue/services/chat/chat.interface";

@Component({})
export default class ChatRoomList extends Vue {
  t = translate;
  roomsList = ChatUserRoomListService.instance;

  otherUsersInfo: UserModel[] = [];

  getUserName(room: ChatUserRoomModel) {
    const user = this.otherUsersInfo.filter((v) => {
      // console.log("v.firebaseUid == room.global.otherUserId", v.firebaseUid, room.global.otherUserId);
      return v.firebaseUid == room.global.otherUserId;
    });

    // console.log("getUserName::", user);
    if (!user.length) return "";
    return user[0].nicknameOrName;
  }

  mounted(): void {
    // this.roomsList.changes.subscribe((r) => {
    //   console.log("this.roomsList.changes.", this.roomsList.rooms, r.global);
    // });
    // console.log("getOtherUserInformation::");
    // setTimeout(() => this.getOtherUserInformation(), 10000);
    this.getOtherUserInformation();
  }

  async getOtherUserInformation(): Promise<void> {
    console.log("this.roomsList.rooms.length", this.roomsList.rooms.length, this.roomsList.rooms);
    if (!this.roomsList.rooms.length) return;
    const uid: string[] = [];
    for (const room of this.roomsList.rooms) {
      console.log("getOtherUserInformation::room.global.otherUserId::", room.global);
      uid.push(room.global.otherUserId as string);
    }
    console.log("this.roomsList.rooms::", uid);
    if (!uid.length) return;

    try {
      this.otherUsersInfo = await ApiService.instance.otherUsersProfile(uid.join(","));
    } catch (e) {
      this.$app.error(e);
    }

    console.log("getOtherUserInformation::uid:::", uid, this.otherUsersInfo);
  }
}
</script>
