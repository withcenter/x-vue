<template>
  <div class="d-flex">
    <PhotoTextBottom
      class="mr-1 w-50"
      :post="postList[0]"
      :imageHeight="imageHeight"
      :isMultiLine="isMultilineText"
    ></PhotoTextBottom>
    <PhotoTextBottom
      class="w-50"
      :post="postList[1]"
      :imageHeight="imageHeight"
      :isMultiLine="isMultilineText"
    ></PhotoTextBottom>
  </div>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoTextBottom from "./PhotoTextBottom.vue";

@Component({
  components: { PhotoTextBottom },
})
export default class OneByOnePhotoTextBottom extends Vue {
  @Prop()
  categoryId!: string;
  @Prop({ default: 200 })
  imageHeight!: string;
  @Prop({ default: false })
  isMultilineText!: boolean;

  @Prop({
    default: () => {
      const posts = [];
      posts.push(ComponentService.instance.temporaryPost());
      posts.push(ComponentService.instance.temporaryPost());
      return posts;
    },
  })
  posts!: PostModel[];

  postList: PostModel[] = [];

  mounted(): void {
    if (this.categoryId) {
      this.loadPosts();
    } else {
      this.postList = this.posts;
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.postList = await ApiService.instance.postSearch({ categoryId: this.categoryId, files: "Y", limit: 2 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
