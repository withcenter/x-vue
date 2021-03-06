<template>
  <router-link class="photo-inline-text-bottom d-block" :to="story.relativeUrl" v-if="story && story.idx">
    <div class="w-100 position-relative">
      <b-img-lazy fluid-grow block class="primary" :src="src"> </b-img-lazy>
      <div class="title position-absolute w-100 text-white" :class="isMultiLine ? '' : 'text-truncate'">
        {{ story.title }}
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.photo-inline-text-bottom {
  .title {
    overflow: hidden;
    padding: 0.25em 1em;
    background-color: rgba(1, 1, 1, 0.6) !important;
    max-height: 2em;
    bottom: 0;
    font-size: 0.9em;
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
  @Prop() post!: PostModel;
  @Prop() categoryId!: string;
  @Prop({ default: false }) isMultiLine!: boolean;
  @Prop({ default: 100 }) w!: number;
  @Prop({ default: 100 }) h!: number;

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
    return ApiService.instance.thumbnailUrl(this.story.files[0].idx, this.w, this.h, 100);
  }

  async loadPost(): Promise<void> {
    try {
      const res = await ApiService.instance.latestPosts({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.story = res[0];
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
