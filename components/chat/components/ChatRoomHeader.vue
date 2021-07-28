<template>
  <section class="chat-room-header">
    <div class="d-flex justify-content-between mb-2">
      <div class="user-avatar d-flex align-items-center text-nowrap">
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
  </section>
</template>

<script lang="ts">
import { UserModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { ChatRoomService } from "@/x-vue/services/chat/chat.room.service";
import ComponentService, { PLACEMENT } from "@/x-vue/services/component.service";
import { Vue, Component } from "vue-property-decorator";

import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";

import PushNotificationIcon from "@/x-vue/components/push-notification/PushNotificationIcon.vue";
import { t } from "@/x-vue/services/functions";

@Component({
  components: {
    UserAvatar,
    PushNotificationIcon,
  },
})
export default class ChatRoomHeader extends Vue {
  room = ChatRoomService.instance;

  otherUser: UserModel = new UserModel();

  mounted(): void {
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

  async changeRoomTitle(): Promise<void> {
    ComponentService.instance.promptToast({
      title: t("change_room_title"),
      message: this.room.getTitle,
      placement: PLACEMENT.TOP_CENTER,
      okCallback: async (title: string): Promise<void> => {
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
      const re = await ComponentService.instance.confirm(t("chat_room_delete"), t("chat_room_delete_confirmation"));
      if (re === false) return;

      await this.room.leave();
      this.$router.push("/chat");
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
