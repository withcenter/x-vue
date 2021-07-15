<template>
  <div class="posts-title-list" v-if="postsList.length">
    <div class="post-text" v-for="(post, index) of postsList" :key="post.idx" :class="index > 0 ? 'mt-2' : ''">
      <router-link class="d-flex" :to="post.relativeUrl">
        <span class="mr-2" v-if="bulleted">•</span>
        <div class="d-block text-truncate">
          {{ post.title }}
        </div>
        <b-badge class="ml-2" variant="light" v-if="post.noOfComments">{{ post.noOfComments }}</b-badge>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import { ApiService } from "@/x-vue/services/api.service";

@Component({})
export default class PostsTitleList extends Vue {
  @Prop() categoryId!: string;
  @Prop() posts!: PostModel[];

  @Prop({ default: 5 }) limit!: number;
  @Prop({ default: false }) bulleted!: boolean;

  postsList: PostModel[] = [];

  mounted(): void {
    if (this.posts) {
      this.postsList = this.posts;
    } else if (this.categoryId) {
      this.loadPosts();
    } else {
      for (let i = 1; i <= this.limit; i++) {
        this.postsList.push(ComponentService.instance.temporaryPost());
      }
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.postsList = await ApiService.instance.latestPosts({ categoryId: this.categoryId, limit: this.limit });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
