<template>
  <div class="two-by-two-thumbnail-with-text-bottom">
    <div class="top d-flex" :style="{ height: itemHeight + 'px' }">
      <ThumbnailWithInlineText class="w-50" :post="posts[0]"></ThumbnailWithInlineText>
      <ThumbnailWithInlineText class="pl-1 w-50" :post="posts[1]"></ThumbnailWithInlineText>
    </div>
    <div class="mt-1 bottom d-flex" :style="{ height: itemHeight + 'px' }">
      <ThumbnailWithInlineText class="w-50" :post="posts[2]"></ThumbnailWithInlineText>
      <ThumbnailWithInlineText class="pl-1 w-50" :post="posts[3]"></ThumbnailWithInlineText>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ApiService } from "@/x-vue/services/api.service";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithInlineText from "./ThumbnailWithInlineText.vue";
import ComponentService from "@/x-vue/services/x-vue.service";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    ThumbnailWithInlineText,
  },
})
export default class TwoByTwoThumbnailInlineText extends Vue {
  @Prop({})
  categoryId!: string;
  @Prop({
    default: 150,
  })
  itemHeight!: number;

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
