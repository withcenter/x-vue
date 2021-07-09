<template>
  <div>{{ post.title }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
@Component({
  components: {},
})
export default class Samples extends Vue {
  @Prop() categoryId!: string;

  @Prop({ default: () => ComponentService.instance.temporaryPost() })
  post!: PostModel;

  story: PostModel = new PostModel();

  mounted(): void {
    if (this.categoryId) {
      this.loadPost();
    } else {
      this.story = this.post;
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
