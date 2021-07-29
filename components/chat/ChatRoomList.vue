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
          {{ room.getTitle || room.otherUserDisplayName }}
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

@Component({})
export default class ChatRoomList extends Vue {
  t = translate;
  roomsList = ChatUserRoomListService.instance;
}
</script>
