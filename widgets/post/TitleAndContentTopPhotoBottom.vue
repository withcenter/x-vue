<template>
  <router-link class="text-center" :to="story.relativeUrl">
    <h3 class="title overflow-hidden">{{ story.title }}</h3>
    <h5 class="content text-truncate">{{ story.content }}</h5>
    <b-img class="w-100 mt-2" :src="src" :style="{ height: imageHeight + 'px' }"></b-img>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  max-height: 2.4em;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";

@Component({})
export default class TitleAndContentTopPhotoBottom extends Vue {
  @Prop() categoryId!: string;
  @Prop() post!: PostModel;

  @Prop({ default: 209 }) imageHeight!: string;

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
