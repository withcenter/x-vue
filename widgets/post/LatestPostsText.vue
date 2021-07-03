<template>
  <div v-if="posts.length">
    Latest Posts {{ categoryId }}
    <hr class="my-1" />
    <router-link
      class="d-block text-truncate pt-1 mb-1"
      v-for="post of posts"
      :key="post.idx"
      :to="post.relativeUrl"
    >
      {{ post.title }}
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApiService } from "@/x-vue/services/api.service";
import { PostModel } from "@/x-vue/interfaces/interfaces";
import ComponentService from "@/x-vue/services/x-vue.service";

@Component({})
export default class LatestPostsText extends Vue {
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
        this.posts.push(
          new PostModel().fromJson({
            idx: Math.floor(Math.random() * 100),
            relativeUrl: "#",
            title:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          })
        );
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
