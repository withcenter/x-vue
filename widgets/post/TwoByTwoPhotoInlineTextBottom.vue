<template>
  <div class="two-by-two-thumbnail-with-text-bottom">
    <div class="top d-flex">
      <PhotoInlineTextBottom :imageHeight="imageHeight" class="w-50" :post="posts[0]"></PhotoInlineTextBottom>
      <PhotoInlineTextBottom :imageHeight="imageHeight" class="pl-1 w-50" :post="posts[1]"></PhotoInlineTextBottom>
    </div>
    <div class="mt-1 bottom d-flex">
      <PhotoInlineTextBottom :imageHeight="imageHeight" class="w-50" :post="posts[2]"></PhotoInlineTextBottom>
      <PhotoInlineTextBottom :imageHeight="imageHeight" class="pl-1 w-50" :post="posts[3]"></PhotoInlineTextBottom>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ApiService } from "@/x-vue/services/api.service";
import { Component, Prop } from "vue-property-decorator";

import PhotoInlineTextBottom from "./PhotoInlineTextBottom.vue";
import ComponentService from "@/x-vue/services/component.service";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    PhotoInlineTextBottom,
  },
})
export default class TwoByTwoPhotoInlineTextBottom extends Vue {
  @Prop() categoryId!: string;
  @Prop({ default: 200 }) imageHeight!: number;

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
      this.posts = await ApiService.instance.postSearch({ categoryId: this.categoryId, files: "Y", limit: 4 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
