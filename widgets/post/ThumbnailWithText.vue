<template>
  <section class="thumbnail-with-text">
    <router-link class="d-flex" :to="post.relativeUrl || '#'">
      <div class="image-holder mr-2">
        <b-img
          class="primary"
          :thumbnail="thumbnail"
          rounded="0"
          :src="post.files[0].url"
          v-if="post.files.length"
        ></b-img>
      </div>
      <div class="overflow-hidden">
        <div class="font-weight-bold text-truncate">{{ post.title }}</div>
        <div class="content overflow-hidden">{{ post.content }}</div>
      </div>
    </router-link>
  </section>
</template>

<style lang="scss" scoped>
.content {
  max-height: 3em;
}
// .text-truncate-2line {
//   -webkit-line-clamp: 2;
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// }
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithText extends Vue {
  @Prop({
    type: PostModel,
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  @Prop({ default: false }) thumbnail!: boolean;

  // mounted(): void {
  //   console.log("ThubnailWithText", this.post);
  // }
}
</script>
