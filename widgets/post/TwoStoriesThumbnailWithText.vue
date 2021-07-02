<template>
  <section>
    <thumbnail-with-text
      class="mb-3"
      v-for="(post, index) of posts.slice(0, limit)"
      :key="index"
      :post="post"
      :thumbnailWidth="thumbnailWidth"
      :thumbnailHeight="thumbnailHeight"
    ></thumbnail-with-text>
  </section>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import { Vue, Component, Prop } from "vue-property-decorator";
import ThumbnailWithText from "@/x-vue/widgets/post/ThumbnailWithText.vue";

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
      posts.push(
        new PostModel().fromJson({
          title: "1st Story Title will be here",
          content: "1st Story Content will be here",
          files: [
            {
              url: "https://symbols.getvecta.com/stencil_82/45_google-icon.d8d982f8a1.svg",
            },
          ],
        })
      );
      posts.push(
        new PostModel().fromJson({
          title: "2nd Story Title will be here",
          content: "2nd Story Content will be here",
          // files: [
          //   {
          //     url: "https://symbols.getvecta.com/stencil_82/45_google-icon.d8d982f8a1.svg",
          //   },
          // ],
        })
      );
      posts.push(
        new PostModel().fromJson({
          title: "2nd Story Title will be here",
          content: "2nd Story Content will be here",
          // files: [
          //   {
          //     url: "https://symbols.getvecta.com/stencil_82/45_google-icon.d8d982f8a1.svg",
          //   },
          // ],
        })
      );
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
    console.log("TwoStoriesThumbnailWithText", this.posts);
  }
}
</script>
