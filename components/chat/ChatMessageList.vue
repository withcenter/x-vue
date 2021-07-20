<template>
  <section class="chat-message d-flex flex-column">
    <div class="d-flex justify-content-between mb-2">
      <div class="admin-user-avatar d-flex align-items-center text-nowrap">
        <UserAvatar class="mr-2" :user="otherUser"></UserAvatar>
        <div>
          <div v-if="rooms.global.title">{{ rooms.global.title }}</div>
          <div v-else-if="otherUser.idx">({{ otherUser.idx }}) {{ otherUser.nicknameOrName }}</div>
        </div>
      </div>
      <div class="chat-options d-flex align-items-center">
        <button :id="'chat-options-popover-' + rooms.global.roomId" class="btn btn-sm py-2">
          <font-awesome-icon :icon="['fas', 'cog']" size="lg" />
        </button>

        <b-popover
          placement="bottomleft"
          ref="popover"
          :target="'chat-options-popover-' + rooms.global.roomId"
          triggers="click blur"
        >
          <button data-cy="mine-edit-button" class="btn btn-sm btn-success" @click="leaveRoom">
            {{ "leave" | t }}
          </button>
        </b-popover>
      </div>
    </div>
    <div
      id="chat-message-list"
      class="d-flex flex-column overflow-auto flex-grow-1 mb-2"
      @scroll="rooms.scrollController($event)"
    >
      <div class="flex-grow-1"></div>
      <div
        :id="m.id"
        class="chat-bubble mb-1 rounded-lg my-1 px-2 text-break"
        v-for="m in rooms.messages"
        :key="m.id"
        :class="m.senderUid == rooms.loginUserUid ? 'text-right bg-primary ml-auto' : 'text-left bg-info mr-auto'"
      >
        {{ m.text }}
      </div>
    </div>

    <div class="d-flex">
      <div class="py-1 px-2 pointer">
        <font-awesome-icon :icon="['fas', 'camera']" size="lg" />
      </div>
      <input class="w-100" ref="testInput" type="text" v-model="rooms.textInput" />
      <button class="btn btn-sm btn-primary ml-2 px-5" @click="sendMessage">{{ "Send" | t }}</button>
    </div>
  </section>
</template>

<style scoped>
.chat-message {
  height: 500px;
}

.chat-bubble {
  max-width: 80%;
}
</style>

<script lang="ts">
import { UserModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { ChatRoomService } from "@/x-vue/services/chat/chat.room.service";
import ComponentService from "@/x-vue/services/component.service";
import { Subscription } from "rxjs";
import { Vue, Component } from "vue-property-decorator";

import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";

@Component({
  components: {
    UserAvatar,
  },
})
export default class ChatMessageList extends Vue {
  rooms = ChatRoomService.instance;

  sending = false;

  chatRoomSubscription: Subscription = new Subscription();

  otherUser: UserModel = new UserModel();

  mounted(): void {
    this.chatRoomSubscription = ChatRoomService.instance.changes.subscribe((message) => {
      console.log("chatRoomSubscription", ChatRoomService.instance.atBottom, ChatRoomService.instance.page == 1);
      if (ChatRoomService.instance.atBottom || ChatRoomService.instance.page == 1) {
        ChatRoomService.instance.scrollToBottom();
      }

      console.log("message::changes::", message);
      // this.$nextTick(() => {
      //   let elmnt = document.getElementById(`${message.id}`);
      //   elmnt?.scrollIntoView(false);
      // });
      // let elmnt = document.getElementById(`${message.id}`);
      // elmnt?.scrollIntoView(false);
      // let elmnt = document.getElementById("chat-message-list");
      // elmnt?.scrollTo(0, elmnt.scrollHeight);
    });

    this.loadOtherUser();
  }

  async loadOtherUser(): Promise<void> {
    try {
      console.log("ChatRoomService.instance.global.otherUserId::", ChatRoomService.instance.global.otherUserId);
      this.otherUser = await ApiService.instance.userGet({
        firebaseUid: ChatRoomService.instance.global.otherUserId as string,
      });

      console.log("loadOtherUser", this.otherUser);
    } catch (error) {
      ComponentService.instance.error(error);
    }
  }

  destroyed(): void {
    console.log("ChatMessageListScreen::destroyed()");
    ChatRoomService.instance.unsubscribe();
    this.chatRoomSubscription.unsubscribe();
  }

  async sendMessage(): Promise<void> {
    if (this.rooms.textInput.trim().length == 0 || this.sending) return;
    this.sending = true;
    const tempText: string = this.rooms.textInput;
    this.rooms.textInput = "";
    try {
      await this.rooms.sendMessage({
        text: tempText,
        displayName: this.rooms.displayName,
      });
      this.sending = false;

      (this.$refs.testInput as HTMLElement)?.focus();
    } catch (e) {
      ComponentService.instance.error(e);

      this.sending = false;
    }
  }

  async leaveRoom(): Promise<void> {
    await this.rooms.leave();
    this.$router.push("/chat");
  }
}
</script>
