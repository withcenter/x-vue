<template>
  <router-link class="thumbnail-with-text-bottom" v-if="post && post.idx" :to="post.relativeUrl">
    <img class="image w-100" :src="src" />
    <div class="p-2 title w-100 overflow-hidden">
      <b>{{ post.title }}</b>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  max-height: 3.8em;
  font-size: 1em;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/interfaces";

@Component({})
export default class ThumbnailWithTextBottom extends Vue {
  @Prop({
    default: () => {
      return new PostModel().fromJson({
        idx: 1,
        title:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        files: [
          {
            url: "https://spaceplace.nasa.gov/nebula/en/nebula3.en.jpg",
          },
        ],
        relativeUrl: "#",
      });
    },
  })
  post!: PostModel;

  @Prop({
    default: 150,
  })
  imageHeight!: number;

  get src(): string {
    if (!this.post.files.length) return "";
    return this.post.files[0].url;
  }
}
</script>
