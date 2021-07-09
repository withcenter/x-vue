<template>
  <div class="photo-with-texts-at-bottom">
    <router-link :to="post.relativeUrl">
      <b-img class="w-100" :src="src" :style="{ height: imageHeight + 'px' }"></b-img>
      <div class="text-meta mt-2">
        <div class="category">{{ post.categoryId }}</div>
        <div class="title text-truncate">{{ post.title }}</div>
        <div class="content">{{ post.content }}</div>
        <div class="author">
          <span>{{ post.user.nicknameOrName }}</span>
          <span class="text-muted"> ∙ {{ post.shortDate }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.category {
  font-weight: 700;
  color: rgb(182, 33, 182);
}
.title {
  font-weight: 700;
}
.content {
  max-height: 3em;
  overflow: hidden;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import PostsTitleList from "./PostsTitleList.vue";
import { ApiService } from "@/x-vue/services/api.service";

@Component({
  components: { PostsTitleList },
})
export default class ThumbnailWithTextAndMetaAtBottom extends Vue {
  @Prop()
  categoryId!: string;

  @Prop({ default: 200 })
  imageHeight!: number;

  @Prop({
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

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
