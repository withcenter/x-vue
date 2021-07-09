<template>
  <div class="photo-with-text-right" v-if="story">
    <router-link :to="story.relativeUrl">
      <h3 class="text-truncate">{{ story.title }}</h3>
    </router-link>
    <div class="d-flex">
      <router-link :to="story.relativeUrl">
        <b-img class="photo" :src="src" :style="{ height: imageHeight + 'px' }"> </b-img>
      </router-link>
      <LatestPostsText class="ml-2 text-truncate" :categoryId="categoryId" :limit="limit"></LatestPostsText>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.photo {
  height: 215px;
  max-width: 250px !important;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";

import LatestPostsText from "./LatestPostsText.vue";

@Component({
  components: {
    LatestPostsText,
  },
})
export default class PhotoWithTextsAtRight extends Vue {
  @Prop() categoryId!: string;
  @Prop() post!: PostModel;
  @Prop({ default: 8 }) limit!: number;
  @Prop({ default: 215 }) imageHeight!: number;

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
