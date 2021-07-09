<template>
  <div>
    <ThumbnailWithTextAtRight
      :class="index > 0 ? 'mt-2' : ''"
      v-for="(post, index) of posts"
      :key="post.idx"
      :post="post"
      :isMultiLine="isMultiLine"
      :height="itemHeight"
      :isCenterAligned="isTextCentered"
    ></ThumbnailWithTextAtRight>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";

import ThumbnailWithTextAtRight from "./ThumbnailWithTextAtRight.vue";

@Component({
  components: { ThumbnailWithTextAtRight },
})
export default class ThumbnailWithTextAtRightList extends Vue {
  @Prop({}) categoryId!: string;
  @Prop({ default: 2 }) limit!: number;
  @Prop({ default: 70 }) itemHeight!: number;
  @Prop({ default: false }) isMultiLine!: boolean;
  @Prop({ default: true }) isTextCentered!: boolean;

  posts: PostModel[] = [];

  mounted(): void {
    if (!this.categoryId) {
      for (let i = 1; i <= this.limit; i++) {
        this.posts.push(ComponentService.instance.temporaryPost());
      }
    } else {
      this.loadPosts();
    }
  }

  async loadPosts(): Promise<void> {
    try {
      this.posts = await ApiService.instance.postSearch({ categoryId: this.categoryId, files: "Y", limit: this.limit });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
