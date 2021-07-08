<template>
  <div class="photo-with-texts-at-bottom">
    <router-link :to="post.relativeUrl">
      <b-img class="w-100" :src="src" :style="{ height: imageHeight + 'px' }"></b-img>
    </router-link>
    <PostsTitleList class="posts-text mt-2" :categoryId="categoryId" :limit="limit"></PostsTitleList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import PostsTitleList from "./PostsTitleList.vue";
import { ApiService } from "@/x-vue/services/api.service";

// TODO: update UI
@Component({
  components: { PostsTitleList },
})
export default class PhotoWithTextsAtBottom extends Vue {
  @Prop()
  categoryId!: string;

  @Prop({ default: 200 })
  imageHeight!: number;

  @Prop({ default: 5 })
  limit!: number;

  get src(): string {
    if (!this.post.files.length) return "";
    else return this.post.files[0].url;
  }

  post: PostModel = new PostModel();

  async mounted(): Promise<void> {
    if (!this.categoryId) {
      this.post = ComponentService.instance.temporaryPost();
    } else {
      const res = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.post = res[0];
    }
  }
}
</script>
