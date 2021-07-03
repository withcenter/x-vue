<template>
  <div class="two-by-two-thumbnail-with-text-bottom w-100">
    <div class="top d-flex">
      <ThumbnailWithTextBottom :post="posts[0]"></ThumbnailWithTextBottom>
      <ThumbnailWithTextBottom class="pl-1" :post="posts[0]"></ThumbnailWithTextBottom>
    </div>
    <div class="mt-1 bottom d-flex">
      <ThumbnailWithTextBottom :post="posts[0]"></ThumbnailWithTextBottom>
      <ThumbnailWithTextBottom class="pl-1" :post="posts[0]"></ThumbnailWithTextBottom>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";

import ThumbnailWithTextBottom from "./ThumbnailWithTextBottom.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    ThumbnailWithTextBottom,
  },
})
export default class TwoByTwoThumbnailWithTextBottom extends Vue {
  @Prop({})
  categoryId!: string;

  posts: PostModel[] = [];

  async mounted(): Promise<void> {
    if (!this.categoryId) return;
    try {
      this.posts = await ApiService.instance.postSearch({
        categoryId: this.categoryId,
        limit: 4,
        files: "Y",
      });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
