<template>
  <div class="m-0 row">
    <ThumbnailWithTextBottom
      class="col-3 p-1"
      v-for="post of posts"
      :key="post.idx"
      :post="post"
    ></ThumbnailWithTextBottom>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";

import ComponentService from "@/x-vue/services/component.service";
import ThumbnailWithTextBottom from "./ThumbnailWithTextBottom.vue";

@Component({
  components: { ThumbnailWithTextBottom },
})
export default class FourPhotosWithTextBottom extends Vue {
  @Prop({})
  categoryId!: string;

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
      this.posts = await ApiService.instance.postSearch({ categoryId: this.categoryId });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
