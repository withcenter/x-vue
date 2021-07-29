<template>
  <section class="chat-room-bottom-actions">
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
  </section>
</template>

<script lang="ts">
import { FileModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { ChatRoomService } from "@/x-vue/services/chat/chat.room.service";
import ComponentService from "@/x-vue/services/component.service";
import { Vue, Component } from "vue-property-decorator";

import UploadButton from "@/x-vue/components/UploadButton.vue";
import { isImageUrl } from "@/x-vue/services/chat/chat.functions";

import { t } from "@/x-vue/services/functions";

@Component({
  components: {
    UploadButton,
  },
})
export default class ChatRoomBottomActions extends Vue {
  room = ChatRoomService.instance;

  sending = false;
  progress = 0;

  async sendMessage(): Promise<void> {
    if (this.room.textInput.trim().length == 0 || this.sending) return;
    this.sending = true;
    const tempText: string = this.room.textInput;
    this.room.textInput = "";
    try {
      const isEdit = this.room.isMessageEdit;
      await this.room.sendMessage({
        text: tempText,
        displayName: ApiService.instance.user.nicknameOrName,
      });
      this.sending = false;

      (this.$refs.testInput as HTMLElement)?.focus();

      if (isEdit == null) {
        /// Send Push Notification Silently
        ApiService.instance.sendMessageToUsers({
          users: this.room.otherUserId,
          subscription: this.room.topic,
          title: ApiService.instance.user.nicknameOrName + " " + t("sent_a_message"),
          body: tempText,
          click_action: "chat-message?roomId=" + this.room.id,
          data: {
            type: "chat",
            roomId: this.room.id,
          },
        });
      }
    } catch (e) {
      ComponentService.instance.error(e);

      this.sending = false;
    }
  }

  async onSuccess(file: FileModel): Promise<void> {
    console.log("onSuccess::", file);

    try {
      await this.room.sendMessage({
        text: isImageUrl(file.url) ? file.thumbnailUrl : file.url,
        displayName: ApiService.instance.user.nicknameOrName,
        extra: { url: file.url, idx: file.idx },
      });
      this.sending = false;
      /// Send Push Notification Silently
      ApiService.instance.sendMessageToUsers({
        users: this.room.otherUserId,
        subscription: this.room.topic,
        title: ApiService.instance.user.nicknameOrName + " " + t("sent_a_message"),
        body: t("sent_a_file"),
        click_action: "chat-message?roomId=" + this.room.id,
        data: {
          type: "chat",
          roomId: this.room.id,
        },
      });

      (this.$refs.testInput as HTMLElement)?.focus();
    } catch (e) {
      ComponentService.instance.error(e);

      this.sending = false;
    }
  }
}
</script>
