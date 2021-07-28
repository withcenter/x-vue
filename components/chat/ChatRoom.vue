<template>
  <section class="chat-message d-flex flex-column">
    <ChatRoomHeader></ChatRoomHeader>
    <ChatRoomMessageList></ChatRoomMessageList>
    <ChatRoomBottomActions></ChatRoomBottomActions>
  </section>
</template>

<style lang="scss" scoped>
.chat-message {
  height: 600px;
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ChatRoomHeader from "./components/ChatRoomHeader.vue";
import ChatRoomMessageList from "./components/ChatRoomMessageList.vue";
import ChatRoomBottomActions from "./components/ChatRoomBottomActions.vue";
@Component({
  components: {
    ChatRoomHeader,
    ChatRoomMessageList,
    ChatRoomBottomActions,
  },
})
export default class ChatRoom extends Vue {}
</script>
