<template>
  <section>
    <router-link class="d-flex justify-content-start" :to="post.relativeUrl || '#'">
      <div v-if="post.files.length">
        <div class="mr-3" :style="'height:' + thumbnailHeight + 'px;width:' + thumbnailWidth + 'px'">
          <b-img
            :width="thumbnailWidth"
            :style="'height:' + thumbnailHeight + 'px;'"
            :thumbnail="thumbnail"
            fluid
            rounded="0"
            :src="post.files[0].url"
          ></b-img>
        </div>
      </div>
      <div class="flex-grow-1 overflow-hidden">
        <div class="font-weight-bold text-truncate">{{ post.title }}</div>
        <div class="text-truncate-2line">{{ post.content }}</div>
      </div>
    </router-link>
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

  @Prop({ default: 70 })
  thumbnailWidth!: number;

  @Prop({ default: 70 })
  thumbnailHeight!: number;

  @Prop({ default: false }) thumbnail!: boolean;

  // mounted(): void {
  //   console.log("ThubnailWithText", this.post);
  // }
}
</script>
