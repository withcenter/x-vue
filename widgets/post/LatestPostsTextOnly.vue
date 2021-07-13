<template>
  <div class="latest-posts-text-only" v-if="posts.length">
    <router-link
      class="title d-flex align-items-center justify-content-between"
      v-for="post of posts"
      :key="post.idx"
      :to="post.relativeUrl"
    >
      <div class="d-block text-truncate">
        {{ post.title }}
      </div>
      <b-badge class="ml-2" variant="light" v-if="post.noOfComments">{{ post.noOfComments }}</b-badge>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.title {
  padding: 0.05em 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({})
export default class extends Vue {
  @Prop({}) categoryId!: string;
  @Prop({ default: 10 }) limit!: number;

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
      this.posts = await ApiService.instance.latestPosts({
        categoryId: this.categoryId,
        limit: this.limit,
      });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
