<template>
  <section>
    <div v-for="room in chat.userRoomList.rooms" :key="room.id">
      <router-link :to="{ path: 'chat-message', query: { id: room.id } }">{{ room.id }}</router-link>
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
