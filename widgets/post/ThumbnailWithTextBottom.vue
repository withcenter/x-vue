<template>
  <router-link
    class="thumbnail-with-text-bottom h-100"
    v-if="post && post.idx"
    :to="link"
  >
    <img class="image w-100" :src="src" />
    <div class="title overflow-hidden">
      <b>{{ post.title }}</b>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  height: 2.6em;
  line-height: 1.3em;
  font-size: 1.2em;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { PostModel } from "@/x-vue/services/interfaces";

@Component({
  props: ["post"],
})
export default class ThumbnailWithTextBottom extends Vue {
  post!: PostModel;

  get src(): string {
    if (!this.post.files.length) return "";
    return this.post.files[0].url;
  }

  get title(): string {
    if (!this.post) return "Sample title";
    return this.post.title;
  }

  get link(): string {
    if (!this.post.relativeUrl) return "#";
    return this.post.relativeUrl;
  }
}
</script>
