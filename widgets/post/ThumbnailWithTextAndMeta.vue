<template>
  <router-link :to="story.relativeUrl" class="d-flex">
    <b-img class="image col-3 p-0" :src="src"></b-img>
    <div class="text-meta col-9">
      <div class="category">{{ story.categoryId }}</div>
      <div class="title text-truncate">{{ story.title }}</div>
      <div class="content">{{ story.content }}</div>
      <div class="author">
        <span>{{ story.user.nicknameOrName }}</span>
        <span class="text-muted"> ∙ {{ story.shortDate }}</span>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.image {
  height: 130px;
}

.text-meta {
  padding: 0 0 0 0.5em;
}

.category {
  font-weight: 700;
  color: rgb(2, 174, 2);
}
.title {
  margin-top: 0.25em;
  font-weight: 700;
}
.content {
  margin-top: 0.25em;
  height: 3em;
  overflow: hidden;
  font-weight: 500;
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextAndMeta extends Vue {
  @Prop() categoryId!: string;
  @Prop() post!: PostModel;

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
    return this.story.files[0].thumbnailUrl ? this.story.files[0].thumbnailUrl : this.story.files[0].url;
  }

  async loadPost(): Promise<void> {
    try {
      const res = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.story = res[0];
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
