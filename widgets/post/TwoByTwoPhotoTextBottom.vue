<template>
  <div class="two-by-two-thumbnail-with-text-bottom w-100">
    <div class="top row">
      <PhotoTextBottom class="col-6 pr-1" :post="posts[0]" :isMultiLine="isMultilineText"></PhotoTextBottom>
      <PhotoTextBottom class="col-6 pl-1" :post="posts[1]" :isMultiLine="isMultilineText"></PhotoTextBottom>
    </div>
    <div class="mt-2 bottom row">
      <PhotoTextBottom class="col-6 pr-1" :post="posts[2]" :isMultiLine="isMultilineText"></PhotoTextBottom>
      <PhotoTextBottom class="col-6 pl-1" :post="posts[3]" :isMultiLine="isMultilineText"></PhotoTextBottom>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";

import PhotoTextBottom from "./PhotoTextBottom.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    PhotoTextBottom,
  },
})
export default class TwoByTwoPhotoTextBottom extends Vue {
  @Prop() categoryId!: string;
  @Prop({ default: true }) isMultilineText!: boolean;

  posts: PostModel[] = [];

  mounted(): void {
    if (!this.categoryId) {
      for (let i = 1; i <= 4; i++) {
        this.posts.push(ComponentService.instance.temporaryPost());
      }
    } else {
      this.loadPosts();
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.posts = await ApiService.instance.latestPosts({ categoryId: this.categoryId, files: "Y", limit: 4 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
