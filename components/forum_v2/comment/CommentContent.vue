<template>
  <div>
    <article class="comment-content" v-if="comment.notDeleted">{{ comment.idx }}. {{ comment.content }}</article>
    <article v-else>{{ comment.idx }}. has been deleted</article>
  </div>
</template>
<style lang="scss" scoped>
.comment-content {
  padding: 1em;
  background-color: beige;
  white-space: pre-line;
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
