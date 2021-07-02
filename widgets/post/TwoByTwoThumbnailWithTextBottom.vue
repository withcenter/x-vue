<template>
  <div class="two-by-two-thumbnail-with-text-bottom" v-if="categoryId">
    <div class="top d-flex" :style="{ height: height + 'px' }">
      <ThumbnailWithTextBottom :post="posts[0]"></ThumbnailWithTextBottom>
      <ThumbnailWithTextBottom
        class="pl-1"
        :post="posts[0]"
      ></ThumbnailWithTextBottom>
    </div>
    <div class="mt-1 bottom d-flex" :style="{ height: height + 'px' }">
      <ThumbnailWithTextBottom :post="posts[0]"></ThumbnailWithTextBottom>
      <ThumbnailWithTextBottom
        class="pl-1"
        :post="posts[0]"
      ></ThumbnailWithTextBottom>
    </div>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { PostModel } from "@/x-vue/services/interfaces";
import ComponentService from "@/x-vue/services/x-vue.service";
import Vue from "vue";

import Component from "vue-class-component";
import ThumbnailWithTextBottom from "./ThumbnailWithTextBottom.vue";

@Component({
  props: ["categoryId", "itemHeight"],
  components: {
    ThumbnailWithTextBottom,
  },
})
export default class TwoByTwoThumbnailWithTextBottom extends Vue {
  categoryId!: string;
  itemHeight!: number;

  posts: PostModel[] = [];

  get height(): number {
    if (!this.itemHeight) return 150;
    return this.itemHeight;
  }

  async mounted(): Promise<void> {
    const categoryId = this.categoryId;
    try {
      this.posts = await ApiService.instance.postSearch({
        categoryId,
        limit: 4,
        files: "Y",
      });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
