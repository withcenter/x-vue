<template>
  <div class="one-by-one-photo-inline-text d-flex">
    <PhotoInlineTextBottom class="mr-2 w-50" :post="postList[0]" :isMultiLine="isMultilineText"></PhotoInlineTextBottom>
    <PhotoInlineTextBottom class="w-50" :post="postList[1]" :isMultiLine="isMultilineText"></PhotoInlineTextBottom>
  </div>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoInlineTextBottom from "./PhotoInlineTextBottom.vue";

@Component({
  components: { PhotoInlineTextBottom },
})
export default class OneByOnePhotoInlineText extends Vue {
  @Prop() categoryId!: string;
  @Prop({ default: false }) isMultilineText!: boolean;

  @Prop({
    default: () => {
      const posts = [];
      posts.push(ComponentService.instance.temporaryPost());
      posts.push(ComponentService.instance.temporaryPost());
      return posts;
    },
  })
  posts!: PostModel[];

  postList: PostModel[] = [];

  mounted(): void {
    if (this.categoryId) {
      this.loadPosts();
    } else {
      this.postList = this.posts;
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.postList = await ApiService.instance.latestPosts({ categoryId: this.categoryId, files: "Y", limit: 2 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
