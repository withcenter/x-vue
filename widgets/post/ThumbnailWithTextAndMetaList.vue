<template>
  <div class="thumbnail-with-text-and-meta-list">
    <ThumbnailWithTextAndMeta
      :class="index > 0 ? 'mt-2' : ''"
      v-for="(post, index) of posts"
      :key="post.idx"
      :post="post"
    ></ThumbnailWithTextAndMeta>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";

import ThumbnailWithTextAndMeta from "./ThumbnailWithTextAndMeta.vue";
import { ApiService } from "@/x-vue/services/api.service";

@Component({
  components: { ThumbnailWithTextAndMeta },
})
export default class ThumbnailWithTextAndMetaList extends Vue {
  @Prop() categoryId!: string;
  @Prop({ default: 5 }) limit!: number;

  posts: PostModel[] = [];

  mounted(): void {
    if (!this.categoryId) {
      for (let i = 1; i <= this.limit; i++) {
        this.posts.push(ComponentService.instance.temporaryPost());
      }
    } else {
      this.loadPosts();
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.posts = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: this.limit, files: "Y" });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
