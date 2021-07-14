<template>
  <div class="four-photos-with-text-bottom m-0 container" v-if="posts">
    <div class="row">
      <PhotoTextBottom class="col-3 p-0 pr-1" :post="posts[0]"></PhotoTextBottom>
      <PhotoTextBottom class="col-3 p-0 px-1" :post="posts[1]"></PhotoTextBottom>
      <PhotoTextBottom class="col-3 p-0 px-1" :post="posts[2]"></PhotoTextBottom>
      <PhotoTextBottom class="col-3 p-0 pl-1" :post="posts[3]"></PhotoTextBottom>
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
  @Prop({}) categoryId!: string;
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
      this.posts = await ApiService.instance.latestPosts({ categoryId: this.categoryId, files: "Y", limit: 4 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
