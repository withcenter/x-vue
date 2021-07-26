<template>
  <router-link class="thumbnail-with-text-and-meta row no-gutters" :to="story.relativeUrl" v-if="story && story.idx">
    <!-- <div class="col-3 image-holder"> -->
    <b-img-lazy class="col-4 p-0 primary" :src="src"></b-img-lazy>
    <!-- </div> -->
    <div class="col-8 text-meta pl-2 overflow-hidden">
      <div class="category">{{ story.categoryId | t }}</div>
      <div class="title text-truncate font-weight-bold">{{ story.title }}</div>
      <div class="content mt-2 two-line-truncate">{{ story.content }}</div>
      <div class="author mt-2 text-truncate">
        <span>{{ story.user.nicknameOrName }}</span>
        <span class="text-muted"> ∙ {{ story.shortDate }}</span>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.two-line-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.category {
  font-size: 0.85em;
}
.content {
  font-size: 0.85em;
  max-height: 3em;
  overflow: hidden;
}
.author {
  font-size: 0.85em;
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class extends Vue {
  @Prop() categoryId!: string;
  @Prop() post!: PostModel;

  @Prop({ default: 100 }) w!: number;
  @Prop({ default: 100 }) h!: number;

  story: PostModel = new PostModel();

  mounted(): void {
    if (this.post) {
      this.story = this.post;
    } else if (this.categoryId) {
      this.loadPost();
    } else {
      this.story = ComponentService.instance.temporaryPost();
    }
  }

  get src(): string {
    if (!this.story.files.length) return "";
    return ApiService.instance.thumbnailUrl(this.story.files[0].idx, this.w, this.h, 100);
  }

  async loadPost(): Promise<void> {
    try {
      const res = await ApiService.instance.latestPosts({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.story = res[0];
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
