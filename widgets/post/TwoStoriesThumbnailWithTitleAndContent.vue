<template>
  <section>
    <ThumbnailWithTitleAndContent
      class="mb-3"
      v-for="(post, index) of posts.slice(0, limit)"
      :key="index"
      :post="post"
      :thumbnailWidth="thumbnailWidth"
      :thumbnailHeight="thumbnailHeight"
    ></ThumbnailWithTitleAndContent>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import ThumbnailWithTitleAndContent from "@/x-vue/widgets/post/ThumbnailWithTitleAndContent.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";

@Component({
  components: {
    ThumbnailWithTitleAndContent,
  },
})
export default class TwoStoriesThumbnailWithTitleAndContent extends Vue {
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

  @Prop({ default: 70 })
  thumbnailWidth!: number;

  @Prop({ default: 70 })
  thumbnailHeight!: number;

  @Prop({ default: 2 })
  limit!: number;

  mounted(): void {
    console.log("TwoStoriesThumbnailWithTitleAndContent", this.posts);
  }
}
</script>
