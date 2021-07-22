<template>
  <section>
    <div v-for="room in chat.userRoomList.rooms" :key="room.id">
      <!-- <b-avatar class="avatar" :src="user.photoUrl"></b-avatar> -->
      <router-link class="fs-lg" :to="{ path: 'chat-message', query: { id: room.id } }">{{
        room.global.title || room.id
      }}</router-link>
      <div>{{ room.senderUid == chat.loginUserUid ? "you" : room.senderDisplayName }}{{ room.text }}</div>
    </div>
  </section>
</template>

<script lang="ts">
import { ChatService } from "@/x-vue/services/chat/chat.service";
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class ChatRoomList extends Vue {
  chat = ChatService.instance;

  mounted(): void {
    //
  }

  destroyed(): void {
    //
  }
}
</script>
