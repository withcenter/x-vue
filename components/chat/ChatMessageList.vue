<template>
  <section class="chat-message d-flex flex-column">
    <div class="d-flex justify-content-between mb-2">
      <div class="admin-user-avatar d-flex align-items-center text-nowrap">
        <UserAvatar class="mr-2" :user="otherUser"></UserAvatar>
        <div>
          <div v-if="room.global.title">{{ room.global.title }}</div>
          <div v-else-if="otherUser.idx">({{ otherUser.idx }}) {{ otherUser.nicknameOrName }}</div>
        </div>
      </div>
      <div class="chat-options d-flex align-items-center">
        <PushNotificationIcon :rawTopic="room.topic" :subscribedByDefault="true"></PushNotificationIcon>
        <button :id="'chat-options-popover-' + room.global.roomId" class="btn btn-sm py-2">
          <font-awesome-icon :icon="['fas', 'cog']" size="lg" />
        </button>
        <router-link :to="'/chat'" class="btn btn-sm py-2 pointer">
          <font-awesome-icon :icon="['fas', 'times']" size="lg" />
        </router-link>

        <b-popover
          placement="bottomleft"
          ref="popover"
          :target="'chat-options-popover-' + room.global.roomId"
          triggers="click blur"
        >
          <div class="p-2 pointer" @click="changeRoomTitle">
            <font-awesome-icon :icon="['fas', 'edit']" /> {{ "edit_room_title" | t }}
          </div>
          <router-link class="p-2 pointer" :to="'/chat'">
            <font-awesome-icon :icon="['fas', 'list']" /> {{ "goto_room_list" | t }}
          </router-link>
          <div class="p-2 pointer" @click="leaveRoom">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> {{ "leave_room" | t }}
          </div>
        </b-popover>
      </div>
    </div>
    <div
      :id="room.messageListId"
      class="d-flex flex-column overflow-auto flex-grow-1 mb-2"
      @scroll="room.scrollEventHandler()"
    >
      <div class="flex-grow-1"></div>
      <div class="py-2 mx-auto" v-if="room.loading">
        <b-spinner></b-spinner>
      </div>
      <div
        :id="m.id"
        class="chat-bubble mb-1 rounded-lg my-1 p-2 text-break white"
        v-for="m in room.messages"
        :key="m.id"
        :class="m.isMine ? 'text-right my-chat ml-auto' : 'text-left other-chat mr-auto'"
        @mousedown="onMouseDown(m)"
        @mouseup="onMouseUp(m)"
      >
        <div v-if="!m.isImage">{{ m.text }}</div>
        <b-img v-if="m.isImage" :src="m.text" fluid :alt="m.text" @load="room.onImageLoadComplete(m)"></b-img>
      </div>
    </div>

    <div class="d-flex">
      <div>
        <UploadButton @success="onSuccess"></UploadButton>
      </div>
      <input class="w-100" ref="testInput" type="text" v-model="room.textInput" @keypress.enter="sendMessage" />
      <button class="btn btn-sm btn-primary ml-2 px-5" @click="sendMessage">{{ "Send" | t }}</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.chat-message {
  height: 500px;

  .my-chat {
    background-color: #00bfff;
  }
  .other-chat {
    background-color: #242526;
  }
}

.chat-bubble {
  max-width: 70%;
}
</style>

<script lang="ts">
import { FileModel, UserModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { ChatRoomService } from "@/x-vue/services/chat/chat.room.service";
import ComponentService, { PLACEMENT } from "@/x-vue/services/component.service";
import { Subscription } from "rxjs";
import { Vue, Component } from "vue-property-decorator";

import UploadButton from "@/x-vue/components/UploadButton.vue";
import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";
import { isImageUrl } from "@/x-vue/services/chat/chat.functions";

import PushNotificationIcon from "@/x-vue/components/push-notification/PushNotificationIcon.vue";
import { ChatMessageModel } from "@/x-vue/services/chat/chat.interface";

@Component({
  components: {
    UserAvatar,
    UploadButton,
    PushNotificationIcon,
  },
})
export default class ChatMessageList extends Vue {
  room = ChatRoomService.instance;

  sending = false;

  chatRoomSubscription: Subscription = new Subscription();

  otherUser: UserModel = new UserModel();

  mounted(): void {
    this.chatRoomSubscription = ChatRoomService.instance.changes.subscribe(() => {
      // console.log("message::changes::", message);
      // console.log("chatRoomSubscription", ChatRoomService.instance.atBottom, ChatRoomService.instance.page == 1);
      if (ChatRoomService.instance.atBottom || ChatRoomService.instance.page == 1) {
        ChatRoomService.instance.scrollToBottom();
      }
    });

    this.loadOtherUser();
  }

  async loadOtherUser(): Promise<void> {
    try {
      // console.log("ChatRoomService.instance.global.otherUserId::", ChatRoomService.instance.global.otherUserId);
      this.otherUser = await ApiService.instance.otherUserProfile(
        ChatRoomService.instance.global.otherUserId as string
      );

      // console.log("loadOtherUser", this.otherUser);
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
    if (this.room.textInput.trim().length == 0 || this.sending) return;
    this.sending = true;
    const tempText: string = this.room.textInput;
    this.room.textInput = "";
    try {
      await this.room.sendMessage({
        text: tempText,
        displayName: ApiService.instance._user.nicknameOrName,
      });
      this.sending = false;

      (this.$refs.testInput as HTMLElement)?.focus();
    } catch (e) {
      ComponentService.instance.error(e);

      this.sending = false;
    }
  }

  async changeRoomTitle(): Promise<void> {
    ComponentService.instance.promptToast({
      title: "Change Room Title",
      message: this.room.title || this.room.id,
      placement: PLACEMENT.TOP_CENTER,
      okCallback: async (title: string): Promise<void> => {
        console.log("title", title);
        try {
          await this.room.updateTitle(title);
        } catch (error) {
          ComponentService.instance.error(error);
        }
      },
      cancelCallback: () => console.log("no"),
    });
  }

  async leaveRoom(): Promise<void> {
    try {
      const re = await ComponentService.instance.confirm("Chat Room delete", "Do you want to delete this chat room?");
      if (re === false) return;

      await this.room.leave();
      this.$router.push("/chat");
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }

  async onSuccess(file: FileModel): Promise<void> {
    console.log("onSuccess::", file);

    try {
      await this.room.sendMessage({
        text: isImageUrl(file.url) ? file.thumbnailUrl : file.url,
        displayName: ApiService.instance._user.nicknameOrName,
        extra: { url: file.url },
      });
      this.sending = false;

      (this.$refs.testInput as HTMLElement)?.focus();
    } catch (e) {
      ComponentService.instance.error(e);

      this.sending = false;
    }
  }

  onMouseDown(message: ChatMessageModel): void {
    console.log(message.isImage);
    if (!message.isMine) return;
    message.longPress = true;
    console.log("onMouseDown", message.longPress);
    setTimeout(() => {
      console.log("onMouseDown", message.longPress);
      if (message.longPress) {
        console.log("show edit");
      }
    }, 2000);
  }

  onMouseUp(message: ChatMessageModel): void {
    if (!message.isMine) return;
    message.longPress = false;
    console.log("onMouseUp", message.longPress);
  }
}
</script>
