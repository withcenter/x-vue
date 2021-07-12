<template>
  <router-link
    class="thumbnail-with-text-at-right d-flex"
    :to="post.relativeUrl"
    :class="isCenterAligned ? 'align-items-center' : ''"
  >
    <b-img class="primary" :src="post.files[0].url"></b-img>
    <div class="ml-2 title overflow-hidden" :class="isMultiLine ? '' : 'text-truncate'">
      {{ post.title }}
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  max-height: 3em;
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextAtRight extends Vue {
  @Prop({ default: () => ComponentService.instance.temporaryPost() })
  post!: PostModel;

  @Prop() categoryId!: string;
  @Prop({ default: true }) isMultiLine!: boolean;
  @Prop({ default: true }) isCenterAligned!: boolean;

  story: PostModel = new PostModel();

  mounted(): void {
    if (this.post) {
      this.story = this.post;
    } else if (this.categoryId) {
      this.loadPosts();
    } else {
      this.story = ComponentService.instance.temporaryPost();
    }
  }

  async loadPosts(): Promise<void> {
    try {
      const res = await ApiService.instance.postSearch({ categoryId: this.categoryId, limit: 1, files: "Y" });
      this.story = res[0];
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
