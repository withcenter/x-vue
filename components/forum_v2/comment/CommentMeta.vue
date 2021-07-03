<template>
  <div>
    <div class="comment-meta" v-if="comment.notDeleted">
      Author {{ comment.user.nicknameOrName }}. {{ comment.shortDate }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.comment-meta {
  padding: 1em;
  background-color: rgb(165, 167, 133);
}
</style>
<script lang="ts">
import { CommentModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() comment!: CommentModel;
}
</script>
