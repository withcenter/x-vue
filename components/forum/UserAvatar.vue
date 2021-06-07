<template>
  <div class="d-flex">
    <b-avatar
      tabindex="0"
      :id="id"
      class="pointer"
      :src="parent.user.src"
      :size="defaultSize + 'em'"
    ></b-avatar>

    <b-popover
      placement="bottomright"
      ref="popover"
      :target="id"
      triggers="click blur"
      v-if="parent && parent.idx"
    >
      <user-menu :user="parent.user"></user-menu>
    </b-popover>
  </div>
</template>

<script lang="ts">
import { CommentModel, PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import UserMenu from "@/x-vue/components/user/forum/UserMenu.vue";

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
  id = "user-avatar-popover-";

  mounted(): void {
    if (this.size) this.defaultSize = this.size;
    this.id += this.parent.idx;
  }
}
</script>
