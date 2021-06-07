<template>
  <div class="d-flex">
    <div tabindex="0" :id="id" class="pointer">
      {{ parent.user.displayName }}
    </div>

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
import UserMenu from "@/components/forum/UserMenu.vue";

@Component({
  props: ["parent"],
  components: {
    UserMenu,
  },
})
export default class UserDisplayName extends Vue {
  parent!: PostModel & CommentModel;

  id = "displayname-popover-";

  mounted(): void {
    this.id += this.parent.idx;
  }
}
</script>
