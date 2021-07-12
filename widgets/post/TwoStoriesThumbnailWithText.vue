<template>
  <section class="two-stories-thumbnail-with-text">
    <ThumbnailWithText
      class="mb-3"
      v-for="(post, index) of posts.slice(0, limit)"
      :key="index"
      :post="post"
      :thumbnail="thumbnail"
    ></ThumbnailWithText>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ThumbnailWithText from "@/x-vue/widgets/post/ThumbnailWithText.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";

@Component({
  components: {
    ThumbnailWithText,
  },
})
export default class TwoStoriesThumbnailWithText extends Vue {
  @Prop({
    type: Array,
    default: () => {
      const posts: PostModel[] = [];
      posts.push(ComponentService.instance.temporaryPost());
      posts.push(ComponentService.instance.temporaryPost());
      posts.push(ComponentService.instance.temporaryPost());
      return posts;
    },
  })
  posts!: PostModel[];

  @Prop({ default: 2 }) limit!: number;
  @Prop({ default: false }) thumbnail!: boolean;

  mounted(): void {
    console.log("TwoStoriesThumbnailWithText", this.posts);
  }
}
</script>
