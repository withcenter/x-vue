<template>
  <section>
    <div
      :id="room.messageListId"
      class="chat-room-message-list d-flex flex-column overflow-auto flex-grow-1 mb-2"
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
          <div class="pointer" v-if="!m.isImage && !m.isMovie" @click="room.editMessage(m)">
            <font-awesome-icon class="mr-2" :icon="['fas', 'edit']" /> {{ "edit" | t }}
          </div>

          <div class="pointer" @click="onDeleteMessage(m)">
            <font-awesome-icon class="mr-2" :icon="['fas', 'trash']" /> {{ "delete" | t }}
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
.chat-room-message-list {
  height: 500px;
}
.my-chat {
  background-color: #00bfff;
}
.other-chat {
  background-color: #242526;
}

.chat-bubble {
  max-width: 70%;
}
</style>

<script lang="ts">
import { ChatRoomService } from "@/x-vue/services/chat/chat.room.service";
import { Vue, Component } from "vue-property-decorator";
import { ChatMessageModel } from "@/x-vue/services/chat/chat.interface";
import { Subscription } from "rxjs";
import ComponentService from "@/x-vue/services/component.service";
import { t } from "@/x-vue/services/functions";
import { ApiService } from "@/x-vue/services/api.service";
@Component({
  components: {},
})
export default class ChatRoomMessageList extends Vue {
  room = ChatRoomService.instance;
  fileImagePreviewUrl = "";

  chatRoomSubscription: Subscription = new Subscription();

  mounted(): void {
    this.chatRoomSubscription = ChatRoomService.instance.changes.subscribe(() => {
      if (ChatRoomService.instance.atBottom || ChatRoomService.instance.page == 1) {
        ChatRoomService.instance.scrollToBottom();
      }
    });
  }

  destroyed(): void {
    console.log("ChatMessageListScreen::destroyed()");
    ChatRoomService.instance.unsubscribe();
    this.chatRoomSubscription.unsubscribe();
  }

  showImagePreview(m: ChatMessageModel): void {
    this.fileImagePreviewUrl = "" + m.extra.url;
    this.$bvModal.show("file-preview-modal");
  }

  async onDeleteMessage(m: ChatMessageModel): Promise<void> {
    try {
      const re = await ComponentService.instance.confirm(
        t("chat_message_delete"),
        t("chat_message_delete_confirmation")
      );
      if (re === false) return;
      await this.room.deleteMessage(m);

      if (m.isMovie || m.isImage) {
        ApiService.instance.fileDelete(m.extra.idx as number);
      }
    } catch (e) {
      ComponentService.instance.error(e);
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
