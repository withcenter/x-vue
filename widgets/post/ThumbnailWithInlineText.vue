<template>
  <router-link :to="post.relativeUrl" v-if="post && post.idx">
    <div class="thumbnail-with-inline-text w-100 position-relative h-100">
      <img class="image h-100 w-100" :src="src" />
      <div class="title position-absolute w-100">
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
    max-height: 3.8em;
    padding: 0.5em;
    color: white;
    font-size: 1em;
    bottom: 0;
  }
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithInlineText extends Vue {
  @Prop({
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  get src(): string {
    if (!this.post.files.length) return "";
    else return this.post.files[0].url;
  }
}
</script>
