<template>
  <div class="d-flex">
    <user-avatar :parent="comment" :size="2.8"></user-avatar>
    <div class="ml-2 text-truncate">
      <user-display-name class="font-weight-bold" :parent="comment"></user-display-name>
      <div>No. {{ comment.idx }} • {{ comment.shortDate }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { CommentModel } from "@/x-vue/interfaces/forum.interface";
import UserDisplayName from "../UserDisplayName.vue";
import UserAvatar from "../UserAvatar.vue";

@Component({
  props: ["comment"],
  components: {
    UserDisplayName,
    UserAvatar,
  },
})
export default class CommentMeta extends Vue {
  comment!: CommentModel;
}
</script>
