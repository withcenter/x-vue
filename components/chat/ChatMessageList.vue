<template>
  <section class="chat-message d-flex flex-column">
    <div class="d-flex justify-content-between mb-2">
      <div class="admin-user-avatar d-flex align-items-center text-nowrap">
        <UserAvatar class="mr-2" :user="otherUser"></UserAvatar>
        <div>
          <div v-if="room.getTitle">{{ room.getTitle }}</div>
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
            <font-awesome-icon class="mr-2" :icon="['fas', 'edit']" /> {{ "edit_room_title" | t }}
          </div>
          <router-link class="p-2 pointer" :to="'/chat'">
            <font-awesome-icon class="mr-2" :icon="['fas', 'list']" /> {{ "goto_room_list" | t }}
          </router-link>
          <div class="p-2 pointer" @click="leaveRoom">
            <font-awesome-icon class="mr-2" :icon="['fas', 'sign-out-alt']" /> {{ "leave_room" | t }}
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
        :id="'chat-message-popover-' + m.id"
        class="chat-bubble mb-1 rounded-lg my-1 p-2 text-break white"
        v-for="m in room.messages"
        :key="m.id"
        :class="m.isMine ? 'text-right my-chat ml-auto' : 'text-left other-chat mr-auto'"
      >
        <b-popover
          v-if="m.canEdit"
          placement="left"
          ref="popover"
          :target="'chat-message-popover-' + m.id"
          triggers="hover focus"
        >
          <div class="pointer" @click="room.editMessage(m)">
            <font-awesome-icon class="mr-2" :icon="['fas', 'edit']" /> {{ "edit" | t }}
          </div>
        </b-popover>
        <div v-if="m.isMine" @mousedown="onMouseDown(m)" @mouseup="onMouseUp(m)">
          <div v-if="m.isImage">
            <b-spinner v-if="!m.rendered"></b-spinner>
            <b-img
              :src="m.text"
              fluid
              :alt="m.text"
              @load="room.onImageLoadComplete(m)"
              @click.prevent="showImagePreview(m)"
            ></b-img>
          </div>

          <div v-else-if="m.isMovie">
            <video width="320" height="240" controls>
              <source :src="m.text" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div v-else>{{ room.text(m, true) }}</div>
        </div>
        <div v-else>
          <div v-if="m.isImage">
            <b-spinner v-if="!m.rendered"></b-spinner>
            <b-img
              :src="m.text"
              fluid
              :alt="m.text"
              @load="room.onImageLoadComplete(m)"
              @click.prevent="showImagePreview(m)"
            ></b-img>
          </div>
          <div v-else-if="m.isMovie">
            <video width="320" height="240" controls>
              <source :src="m.text" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div v-else>{{ room.text(m, true) }}</div>
        </div>
      </div>
    </div>
    <b-progress :value="progress" max="100" class="mb-3 ml-2 mr-2" v-if="progress && progress != 100"></b-progress>
    <div class="d-flex">
      <div>
        <UploadButton @success="onSuccess" @progress="progress = $event"></UploadButton>
      </div>
      <div class="w-100 position-relative">
        <input class="w-100 py-1" ref="testInput" type="text" v-model="room.textInput" @keypress.enter="sendMessage" />
        <div v-if="room.isMessageEdit" class="red position-absolute top right py-1 px-2" @click="room.cancelEdit()">
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <button class="btn btn-sm btn-primary ml-2 px-5" @click="sendMessage">{{ "Send" | t }}</button>
    </div>

    <b-modal :id="'file-preview-modal'" hide-footer>
      <template #modal-title>{{ fileImagePreviewUrl }}</template>
      <div>
        <b-img :src="fileImagePreviewUrl" fluid :alt="fileImagePreviewUrl"></b-img>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('file-preview-modal')">Close</b-button>
    </b-modal>
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

  fileImagePreviewUrl = "";
  progress = 0;

  showImagePreview(m: ChatMessageModel): void {
    this.fileImagePreviewUrl = "" + m.extra.url;
    this.$bvModal.show("file-preview-modal");
  }

  mounted(): void {
    this.chatRoomSubscription = ChatRoomService.instance.changes.subscribe(() => {
      if (ChatRoomService.instance.atBottom || ChatRoomService.instance.page == 1) {
        ChatRoomService.instance.scrollToBottom();
      }
    });

    this.loadOtherUser();
  }

  async loadOtherUser(): Promise<void> {
    if (!ChatRoomService.instance.global.otherUserId) return;
    const otherUserId: string = ChatRoomService.instance.global.otherUserId;
    try {
      this.otherUser = await ApiService.instance.otherUserProfile(otherUserId);
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
      message: this.room.getTitle,
      placement: PLACEMENT.TOP_CENTER,
      okCallback: async (title: string): Promise<void> => {
        console.log("title", title);
        try {
          await this.room.updateTitle(title);
        } catch (error) {
          ComponentService.instance.error(error);
        }
      },
      // cancelCallback: () => console.log("no"),
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
    // console.log("onMouseDown", message.longPress);
    setTimeout(() => {
      // console.log("onMouseDown", message.longPress);
      if (message.longPress) {
        console.log("show edit");
        // $('#chat-message-popover-' + message.id).popover('show')
      }
    }, 2000);
  }

  onMouseUp(message: ChatMessageModel): void {
    if (!message.isMine) return;
    message.longPress = false;
    // console.log("onMouseUp", message.longPress);
  }
}
</script>
