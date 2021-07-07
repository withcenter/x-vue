<template>
  <div class="four-photos-with-text-bottom m-0 row" v-if="posts">
    <div class="w-25 pr-1">
      <PhotoTextBottom :imageHeight="imageHeight" :post="posts[0]"></PhotoTextBottom>
    </div>
    <div class="w-25 pr-1">
      <PhotoTextBottom :imageHeight="imageHeight" :post="posts[1]"></PhotoTextBottom>
    </div>
    <div class="w-25 pr-1">
      <PhotoTextBottom :imageHeight="imageHeight" :post="posts[2]"></PhotoTextBottom>
    </div>
    <div class="w-25">
      <PhotoTextBottom :imageHeight="imageHeight" :post="posts[3]"></PhotoTextBottom>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.four-photos-with-text-bottom > div {
  padding: 0;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";

import ComponentService from "@/x-vue/services/component.service";
import PhotoTextBottom from "./PhotoTextBottom.vue";

@Component({
  components: { PhotoTextBottom },
})
export default class FourPhotosWithTextBottom extends Vue {
  @Prop({})
  categoryId!: string;
  @Prop({
    default: 150,
  })
  imageHeight!: number;

  posts: PostModel[] = [];

  mounted(): void {
    if (!this.categoryId) {
      for (let i = 1; i <= 4; i++) {
        this.posts.push(ComponentService.instance.temporaryPost());
      }
    } else {
      this.loadPosts();
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.posts = await ApiService.instance.postSearch({ categoryId: this.categoryId });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
