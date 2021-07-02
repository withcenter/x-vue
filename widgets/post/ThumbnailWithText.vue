<template>
  <section class="d-flex justify-content-start">
    <div v-if="post.files.length">
      <!-- <img
        :src="post.files[0].url"
        class="mr-3"
        :style="
          'height:' +
          thumbnailSizeHeight +
          'px;width:' +
          thumbnailSizeWidth +
          'px'
        "
      /> -->
      <div
        class="mr-3"
        :style="
          'height:' +
          thumbnailSizeHeight +
          'px;width:' +
          thumbnailSizeWidth +
          'px'
        "
      >
        <b-img
          :width="thumbnailSizeWidth"
          :style="'height:' + thumbnailSizeHeight + 'px;'"
          thumbnail
          fluid
          rounded="0"
          :src="post.files[0].url"
        ></b-img>
      </div>
    </div>
    <div class="flex-grow-1">
      <div class="font-weight-bold text-truncate">{{ post.title }}</div>
      <div class="text-truncate-2line">{{ post.content }}</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.text-truncate-2line {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithText extends Vue {
  @Prop({
    type: PostModel,
    default: () => {
      return new PostModel().fromJson({
        title: "Title will be here",
        content: "Content will be here",
      });
    },
  })
  post!: PostModel;

  @Prop({ default: "100" })
  thumbnailSizeWidth!: string;

  @Prop({ default: "75" })
  thumbnailSizeHeight!: string;

  mounted(): void {
    console.log("ThubnailWithText", this.post);
  }
}
</script>
