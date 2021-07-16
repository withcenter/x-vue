<template>
  <div class="d-flex forum-user-avatar">
    <UserAvatar :user="parent.user" :id="id" tabindex="0"></UserAvatar>
    <b-popover
      placement="bottomright"
      ref="popover"
      :target="id"
      triggers="click blur"
      v-if="parent && parent.idx && id"
    >
      <user-menu :user="parent.user"></user-menu>
    </b-popover>
  </div>
</template>
<style lang="scss" scoped>
.avatar {
  width: 3rem;
  height: 3rem;
}
</style>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserMenu from "@/x-vue/components/forum/UserMenu.vue";
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";
import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";

@Component({
  props: ["parent"],
  components: {
    UserMenu,
    UserAvatar,
  },
})
export default class extends Vue {
  parent!: PostModel & CommentModel;
  gender = "";

  id = "";

  mounted(): void {
    this.id = `user-avatar-popover-${this.parent.idx}`;
  }
}
</script>
