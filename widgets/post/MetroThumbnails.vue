<template>
  <section class="metro-thumbnails container round">
    <div class="row" v-if="posts.length">
      <div class="col-9 pl-0">
        <PhotoInlineTextBottom :post="posts[0]" w="604" h="201"></PhotoInlineTextBottom>

        <ThumbnailWithTextAndMeta
          class="mt-3"
          :post="post"
          w="206"
          h="140"
          v-for="post of posts.slice(2, 4)"
          :key="post.idx"
        ></ThumbnailWithTextAndMeta>
      </div>
      <div class="col-3 pl-0 pr-0">
        <PhotoInlineTextBottom :post="posts[1]" w="206" h="200"></PhotoInlineTextBottom>
        <PhotoInlineTextBottom class="mt-3" :post="posts[4]" w="206" h="140"></PhotoInlineTextBottom>
        <PhotoInlineTextBottom class="mt-3" :post="posts[5]" w="206" h="140"></PhotoInlineTextBottom>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoInlineTextBottom from "./PhotoInlineTextBottom.vue";
import ThumbnailWithTextAndMeta from "./ThumbnailWithTextAndMeta.vue";

@Component({
  components: {
    PhotoInlineTextBottom,
    ThumbnailWithTextAndMeta,
  },
})
export default class extends Vue {
  @Prop() categoryId!: string;
  posts: PostModel[] = [];
  mounted() {
    ApiService.instance
      .latestPosts(
        {
          categoryId: this.categoryId,
          limit: 6,
          files: "Y",
        },
        { callback: (posts) => (this.posts = posts) }
      )
      .then((posts) => (this.posts = posts));
  }
}
</script>
