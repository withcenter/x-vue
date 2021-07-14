<template>
  <div class="photo-inline-text-bottom-list">
    <div :class="{ 'mt-2': index > 0 }" v-for="(post, index) of postList" :key="post.idx">
      <PhotoInlineTextBottom :post="post" :isMultiLine="isMultilineText"></PhotoInlineTextBottom>
    </div>
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
export default class PhotoInlineTextBottomList extends Vue {
  @Prop() categoryId!: string;
  @Prop({ default: false }) isMultilineText!: boolean;
  @Prop({ default: 2 }) limit!: number;

  @Prop({ default: () => [] }) posts!: PostModel[];

  postList: PostModel[] = [];

  mounted(): void {
    if (this.categoryId) {
      this.loadPosts();
    } else if (this.posts.length) {
      this.postList = this.posts;
    } else {
      for (let i = 1; i <= this.limit; i++) {
        this.postList.push(ComponentService.instance.temporaryPost());
      }
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.postList = await ApiService.instance.latestPosts({
        categoryId: this.categoryId,
        files: "Y",
        limit: this.limit,
      });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
