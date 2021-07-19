<template>
  <section>
    <div v-for="room in chat.userRoomList.rooms" :key="room.id">
      <router-link :to="{ path: 'chat-message', query: { id: room.id } }">{{ room.id }}</router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { ChatService } from "@/x-vue/services/chat/chat.service";
import { ChatUserRoomListService } from "@/x-vue/services/chat/chat.user_room_list.service";
import { Subscription } from "rxjs";
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class ChatRoomList extends Vue {
  chat = ChatService.instance;

  chatUserRoomListSubscription: Subscription = new Subscription();
  mounted(): void {
    console.log("Subscribe chatUserRoomListSubscription:: changes");
    this.chatUserRoomListSubscription = ChatUserRoomListService.instance.changes.subscribe((rooms) => {
      console.log("ChatRoomList:: changed", rooms);
    });
  }

  destroyed(): void {
    console.log("Destroy chatUserRoomListSubscription:: changes");
    this.chatUserRoomListSubscription.unsubscribe();
  }
}
</script>
