<template>
  <div class="big-photo" v-if="story && story.idx">
    <router-link :to="story.relativeUrl">
      <img class="primary" :src="src" />
      <div class="mt-2">
        <div class="category">{{ title }}</div>
        <div class="title text-truncate">{{ story.title }}</div>
        <div class="content">{{ story.content }}</div>
        <div class="meta">
          <span>{{ story.user.nicknameOrName }}</span>
          <span class="text-muted"> ∙ {{ story.shortDate }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.category {
  font-weight: bold;
  color: rgb(0, 178, 223);
}
.primary {
  border-radius: 12px;
  width: 100%;
  height: 200px;
}
.title {
  margin-top: 0.35em;
}
.content {
  margin-top: 0.5em;
  max-height: 3em;
  overflow: hidden;
  font-weight: normal;
  font-size: 0.85rem;
}
.meta {
  margin-top: 0.5em;
  font-weight: 300;
  font-size: 0.8rem;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import { AppService } from "@/service/app.service";

@Component({})
export default class ThumbnailWithTextAndMetaAtBottom extends Vue {
  @Prop() categoryId!: string;
  @Prop() subcategory!: string;
  @Prop({ default: "카테고리 + 서브카테고리" }) title!: string;

  story: PostModel = new PostModel();

  app = AppService.instance;

  mounted(): void {
    ApiService.instance
      .latestPosts(
        {
          categoryId: this.categoryId,
          subcategory: this.subcategory,
          limit: 1,
          files: "Y",
        },
        { callback: (posts) => (this.story = posts[0]) }
      )
      .then((posts) => (this.story = posts[0]))
      .catch((e) => this.app.error(e));
  }

  get src(): string {
    if (!this.story.files.length) return "";
    const idx = this.story.files[0].idx;
    return ApiService.instance.thumbnailUrl(idx, 398, 200, 100);
  }
}
</script>
