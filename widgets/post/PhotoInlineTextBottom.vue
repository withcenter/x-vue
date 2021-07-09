<template>
  <router-link :to="story.relativeUrl" v-if="story && story.idx">
    <div class="thumbnail-with-inline-text w-100 position-relative h-100">
      <b-img class="image w-100" :src="src" :style="{ height: imageHeight + 'px' }"> </b-img>
      <div class="title position-absolute w-100" :class="isMultiLine ? '' : 'text-truncate'">
        <b>{{ story.title }}</b>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.thumbnail-with-inline-text {
  overflow: hidden;

  .title {
    background-color: rgba(1, 1, 1, 0.3) !important;
    max-height: 3.7em;
    padding: 0.5em;
    color: white;
    bottom: 0;
  }
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PhotoInlineTextBottom extends Vue {
  @Prop() categoryId!: string;
  @Prop({ default: 200 }) imageHeight!: number;
  @Prop({ default: true }) isMultiLine!: boolean;
  @Prop() post!: PostModel;

  story: PostModel = new PostModel();

  mounted(): void {
    if (this.post) {
      this.story = this.post;
    } else if (this.categoryId) {
      this.loadPost();
    } else {
      this.story = ComponentService.instance.temporaryPost();
    }
  }

  get src(): string {
    if (!this.story.files.length) return "";
    return this.story.files[0].thumbnailUrl ? this.story.files[0].thumbnailUrl : this.story.files[0].url;
  }

  async loadPost(): Promise<void> {
    try {
      const res = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.story = res[0];
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
