<template>
  <router-link
    class="d-flex"
    :to="post.relativeUrl"
    :style="{ height: height + 'px' }"
    :class="isCenterAligned ? 'align-items-center' : ''"
  >
    <b-img class="col-3 p-0 h-100" :src="post.files[0].url"></b-img>
    <div class="overflow-hidden">
      <div class="ml-2 title" :class="isMultiLine ? '' : 'text-truncate'">
        {{ post.title }}
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextAtRight extends Vue {
  @Prop({
    type: PostModel,
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  @Prop() categoryId!: string;
  @Prop({ default: 70 }) height!: number;
  @Prop({ default: false }) isMultiLine!: boolean;
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
