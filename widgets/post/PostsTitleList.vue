<template>
  <div class="posts-title-list">
    <ul class="p-0 m-0" v-if="bulleted">
      <li
        class="post-text text-truncate"
        v-for="(post, index) of postsList"
        :key="post.idx"
        :class="index > 0 ? 'mt-1' : ''"
      >
        <router-link :to="post.relativeUrl">
          {{ post.title }}
        </router-link>
      </li>
    </ul>
    <div v-if="!bulleted">
      <div
        class="post-text text-truncate"
        v-for="(post, index) of postsList"
        :key="post.idx"
        :class="index > 0 ? 'mt-1' : ''"
      >
        <router-link :to="post.relativeUrl">
          {{ post.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
li {
  list-style-position: inside;
}
</style>

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

  @Prop({ default: 5 })
  limit!: number;
  @Prop({ default: false })
  bulleted!: boolean;

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
      this.postsList = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: this.limit });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
