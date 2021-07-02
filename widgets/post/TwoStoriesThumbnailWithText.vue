<template>
  <section>
    <thumbnail-with-text
      v-for="(post, index) of posts"
      :key="index"
      :post="post"
      class="mb-2"
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
          content:
            "1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here ",
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
          content:
            // "2nd Story Content will be here",
            "1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here 1st Story Content will be here ",
          files: [
            {
              url: "https://png.pngtree.com/thumb_back/fh260/background/20190223/ourmid/pngtree-pure-color-watercolor-graffiti-gradient-background-board-design-board-design-image_66713.jpg",
            },
          ],
        })
      );
      return posts;
    },
  })
  posts!: PostModel[];

  mounted(): void {
    console.log("TwoStoriesThumbnailWithText", this.posts);
  }
}
</script>
