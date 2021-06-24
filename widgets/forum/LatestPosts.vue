<template>
  <div v-if="posts.length">
    Latest Posts {{ category }}
    <a v-for="post of posts" :key="post.idx" :href="post.relativeUrl">
      {{ post.title }}
    </a>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { PostModel, RequestData } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["category", "limit"],
})
export default class LatestPosts extends Vue {
  category!: string;
  limit!: number;

  posts: PostModel[] = [];

  options: RequestData = {};

  mounted(): void {
    this.options.category = this.category ?? "qna";
    this.options.limit = this.limit ?? 10;
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    try {
      const res = await ApiService.instance.postSearch(this.options);
      console.log("latestPosts", res);
      this.posts = res;
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
