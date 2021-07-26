<template>
  <section>
    <router-link
      class="d-flex align-items-center"
      v-for="room in roomsList.rooms"
      :key="room.id"
      :to="{ path: 'chat-message', query: { id: room.id } }"
    >
      {{ room }}
      <b-avatar class="avatar mr-2" :src="room.otherUserPhotoUrl"></b-avatar>
      <div>
        <div class="fs-lg">{{ room.title || room.otherUserDisplayName }}</div>
        <div>
          {{ room.senderUid == roomsList.loginUserUid ? "You: " : room.senderDisplayName + ": " }}{{ room.text }}
        </div>
      </div>
    </router-link>
  </section>
</template>

<script lang="ts">
import { ChatUserRoomListService } from "@/x-vue/services/chat/chat.user_room_list.service";
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class ChatRoomList extends Vue {
  roomsList = ChatUserRoomListService.instance;

  mounted(): void {
    //
  }

  destroyed(): void {
    //
  }
}
</script>
