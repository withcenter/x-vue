<template>
  <section class="chat-message d-flex flex-column">
    <div class="d-flex justify-content-between mb-2">
      <div class="py-2">{{ rooms.global.title || rooms.global.roomId }}</div>
      <div class="chat-options">
        <button :id="'chat-options-popover-' + rooms.global.roomId" class="btn btn-sm">
          <GearFillSvg></GearFillSvg>
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
    <div id="chat-message-list" class="d-flex flex-column overflow-auto flex-grow-1" @scroll="rooms.scrollController()">
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
      <input class="w-100" ref="testInput" type="text" v-model="rooms.textInput" />
      <button class="btn btn-sm btn-primary ml-2 px-5" @click="sendMessage">Send</button>
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
/* 
svg {
  width: 6px;
} */
</style>

<script lang="ts">
import { ChatRoomService } from "@/x-vue/services/chat/chat.room.service";
import ComponentService from "@/x-vue/services/component.service";
import { Subscription } from "rxjs";
import { Vue, Component } from "vue-property-decorator";

import GearFillSvg from "@/x-vue/svg/GearFillSvg.vue";

@Component({
  components: {
    GearFillSvg,
  },
})
export default class ChatMessageList extends Vue {
  rooms = ChatRoomService.instance;

  sending = false;

  chatRoomSubscription: Subscription = new Subscription();

  mounted(): void {
    this.chatRoomSubscription = ChatRoomService.instance.changes.subscribe((message) => {
      console.log("message:::::", message);

      //
      // this.$nextTick(() => {
      //   let elmnt = document.getElementById(`${message.id}`);
      //   elmnt?.scrollIntoView(false);
      // });

      // let elmnt = document.getElementById(`${message.id}`);
      // elmnt?.scrollIntoView(false);

      // let elmnt = document.getElementById("chat-message-list");
      // elmnt?.scrollTo(0, elmnt.scrollHeight);
    });
  }

  destroyed(): void {
    console.log("ChatRoomScreen::destroyed()");
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

  onScroll(): void {
    // console.log($event);
  }

  async leaveRoom(): Promise<void> {
    await this.rooms.leave();
    this.$router.push("/chat");
  }
}
</script>
