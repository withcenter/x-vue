<template>
  <router-link class="overflow-hidden" v-if="story && story.idx" :to="post.relativeUrl">
    <b-img class="image w-100" :src="src" :style="{ height: imageHeight + 'px' }"> </b-img>
    <div class="p-2 title" :class="isMultiLine ? 'overflow-hidden' : 'text-truncate'">
      {{ story.title }}
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  max-height: 3.6em;
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PhotoTextBottom extends Vue {
  @Prop() categoryId!: string;
  @Prop({
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  @Prop({ default: 150 })
  imageHeight!: number;

  @Prop({ default: true })
  isMultiLine!: boolean;

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
