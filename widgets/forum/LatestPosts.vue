<template>
  <div v-if="posts.length">
    Latest Posts {{ categoryId }}
    <hr class="my-1" />
    <a
      class="d-block text-truncate"
      v-for="post of posts"
      :key="post.idx"
      :href="post.relativeUrl"
    >
      {{ post.title }}
    </a>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { PostModel, RequestData } from "@/x-vue/services/interfaces";
import ComponentService from "@/x-vue/services/x-vue.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["categoryId", "limit"],
})
export default class LatestPosts extends Vue {
  categoryId!: string;
  limit!: number;

  posts: PostModel[] = [];

  options: RequestData = {};

  mounted(): void {
    this.options.categoryId = this.categoryId ?? "qna";
    this.options.limit = this.limit ?? 10;
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    try {
      const res = await ApiService.instance.postSearch(this.options);
      // console.log("latestPosts", res);
      this.posts = res;
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
