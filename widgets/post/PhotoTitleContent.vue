<template>
  <router-link class="photo-title-content d-flex" :to="story.relativeUrl">
    <div class=""><b-img class="primary" :src="src"></b-img></div>
    <div class="text-meta pl-2 overflow-hidden">
      <div class="title text-truncate">{{ story.title }}</div>
      <div class="content">{{ story.content }}</div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.primary {
  width: 72px;
  height: 72px;
}
.content {
  line-height: 1.3em;
  height: 2.6em;
  overflow: hidden;
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
