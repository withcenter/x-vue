<template>
  <div class="latest-posts-text" v-if="posts.length">
    <div v-if="title">
      {{ title }}
      <hr class="my-1" />
    </div>
    <router-link class="d-block text-truncate mb-2" v-for="post of posts" :key="post.idx" :to="post.relativeUrl">
      {{ post.title }}
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({})
export default class LatestPostsText extends Vue {
  @Prop({})
  title!: string;
  @Prop({})
  categoryId!: string;
  @Prop({
    default: 10,
  })
  limit!: number;

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
      const res = await ApiService.instance.postSearch({
        categoryId: this.categoryId,
        limit: this.limit,
      });
      this.posts = res;
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
