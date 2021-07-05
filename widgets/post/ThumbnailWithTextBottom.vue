<template>
  <router-link class="thumbnail-with-text-bottom" v-if="post && post.idx" :to="post.relativeUrl">
    <img class="image w-100" :src="src" />
    <div class="p-2 title w-100 overflow-hidden">
      <b>{{ post.title }}</b>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  max-height: 3.8em;
  font-size: 1em;
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextBottom extends Vue {
  @Prop({
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  @Prop({
    default: 150,
  })
  imageHeight!: number;

  get src(): string {
    if (!this.post.files.length) return "";
    return this.post.files[0].url;
  }
}
</script>
