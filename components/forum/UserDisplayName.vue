<template>
  <div class="d-flex">
    <div tabindex="0" :id="id" class="pointer" v-if="id">
      {{ parent.user.displayName }}
    </div>

    <b-popover placement="bottomright" ref="popover" :target="id" triggers="click blur" v-if="parent && parent.idx">
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
  props: ["parent"],
  components: {
    UserMenu,
  },
})
export default class UserDisplayName extends Vue {
  parent!: PostModel & CommentModel;

  id = "";

  mounted(): void {
    this.id = `displayname-popover-${this.parent.idx}`;
  }
}
</script>
