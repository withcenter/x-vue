<template>
  <router-link :to="post.relativeUrl" v-if="post && post.idx">
    <div class="thumbnail-with-inline-text w-100 position-relative h-100">
      <img class="image h-100 w-100" :src="src" />
      <div class="title position-absolute">
        <b>{{ post.title }}</b>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.thumbnail-with-inline-text {
  height: 250px;
  overflow: hidden;

  .title {
    background-color: rgba(1, 1, 1, 0.3) !important;
    max-height: 3.9em;
    padding: 0.5em;
    color: white;
    font-size: 1.2em;
    bottom: 0;
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { PostModel } from "@/x-vue/services/interfaces";

@Component({
  props: ["post"],
})
export default class ThumbnailWithInlineText extends Vue {
  post!: PostModel;

  get src(): string {
    if (!this.post.files.length) return "";
    else return this.post.files[0].url;
  }

  get title(): string {
    if (!this.post) return "Sample title";
    else return this.post.title;
  }
}
</script>
