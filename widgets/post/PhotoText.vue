<template>
  <router-link class="photo-text" v-if="story && story.idx" :to="post.relativeUrl">
    <img class="primary" :src="src" />
    <div class="p-1 title">
      {{ story.title }}
    </div>
  </router-link>
</template>
<style lang="scss" scoped>
.photo-text {
  display: block;
  width: 100px;
  height: 120px;
  overflow: hidden;
  font-size: 0.85em;
  img {
    width: 100%;
  }
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
  @Prop({ default: true }) isMultiLine!: boolean;
  @Prop({ default: 184 }) w!: number;
  @Prop({ default: 100 }) h!: number;
  @Prop({ default: () => ComponentService.instance.temporaryPost() })
  post!: PostModel;

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
    return ApiService.instance.thumbnailUrl(this.story.files[0].idx, this.w, this.h);
    // return this.story.files[0].thumbnailUrl ? this.story.files[0].thumbnailUrl : this.story.files[0].url;
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
