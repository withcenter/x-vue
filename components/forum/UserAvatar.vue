<template>
  <div class="d-flex">
    <b-avatar
      tabindex="0"
      :id="id"
      class="pointer"
      :src="parent.user.src || parent.user.photoUrl"
      :size="defaultSize + 'em'"
    ></b-avatar>

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

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserMenu from "@/x-vue/components/forum/UserMenu.vue";
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  props: ["parent", "size"],
  components: {
    UserMenu,
  },
})
export default class UserAvatar extends Vue {
  parent!: PostModel & CommentModel;
  size!: number;

  defaultSize = 3;
  src = "";
  id = "";

  mounted(): void {
    if (this.size) this.defaultSize = this.size;
    this.id = `user-avatar-popover-${this.parent.idx}`;
  }
}
</script>
