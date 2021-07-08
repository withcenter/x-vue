<template>
  <div class="two-by-two-thumbnail-with-text-bottom w-100">
    <div class="top d-flex">
      <PhotoTextBottom
        class="w-50"
        :imageHeight="imageHeight"
        :post="posts[0]"
        :isMultiLine="isMultilineText"
      ></PhotoTextBottom>
      <PhotoTextBottom
        class="w-50 pl-1"
        :imageHeight="imageHeight"
        :post="posts[1]"
        :isMultiLine="isMultilineText"
      ></PhotoTextBottom>
    </div>
    <div class="mt-1 bottom d-flex">
      <PhotoTextBottom
        class="w-50"
        :imageHeight="imageHeight"
        :post="posts[2]"
        :isMultiLine="isMultilineText"
      ></PhotoTextBottom>
      <PhotoTextBottom
        class="w-50 pl-1"
        :imageHeight="imageHeight"
        :post="posts[3]"
        :isMultiLine="isMultilineText"
      ></PhotoTextBottom>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";

import PhotoTextBottom from "./PhotoTextBottom.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    PhotoTextBottom,
  },
})
export default class TwoByTwoPhotoTextBottom extends Vue {
  @Prop({})
  categoryId!: string;

  @Prop({ default: 200 }) imageHeight!: number;

  @Prop({ default: true }) isMultilineText!: boolean;

  posts: PostModel[] = [];

  async mounted(): Promise<void> {
    if (!this.categoryId) return;
    try {
      this.posts = await ApiService.instance.postSearch({
        categoryId: this.categoryId,
        limit: 4,
        files: "Y",
      });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
