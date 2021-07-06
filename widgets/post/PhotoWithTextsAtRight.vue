<template>
  <div class="photo-with-text-right" v-if="post.idx">
    <router-link :to="post.relativeUrl">
      <h3 class="text-truncate">{{ post.title }}</h3>
    </router-link>
    <div class="d-flex">
      <router-link :to="post.relativeUrl">
        <img class="photo" :src="post.files[0].url" />
      </router-link>
      <LatestPostsText class="ml-2 text-truncate" :categoryId="categoryId" :limit="7"></LatestPostsText>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.photo {
  max-height: 215px;
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
  @Prop({})
  categoryId!: string;

  post: PostModel = new PostModel();

  mounted(): void {
    console.log("PhotoWithTextsAtRight");
    if (this.categoryId) {
      this.loadPost();
    } else {
      this.post = ComponentService.instance.temporaryPost();
      console.log(this.post);
    }
  }

  async loadPost(): Promise<void> {
    try {
      const res = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.post = res[0];
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
