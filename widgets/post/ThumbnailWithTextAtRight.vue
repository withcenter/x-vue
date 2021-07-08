<template>
  <router-link
    class="d-flex"
    :to="post.relativeUrl"
    :style="{ height: height + 'px' }"
    :class="isCenterAligned ? 'align-items-center' : ''"
  >
    <b-img class="col-3 p-0 h-100" :src="post.files[0].url"></b-img>
    <div class="overflow-hidden">
      <div class="ml-2 title font-weight-bold" :class="isMultiLine ? '' : 'text-truncate'">
        {{ post.title }}
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.title {
  max-height: 4.5em;
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextAtRight extends Vue {
  @Prop({
    type: PostModel,
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  @Prop({ default: 70 })
  height!: number;

  @Prop({ default: false })
  isMultiLine!: boolean;

  @Prop({ default: true })
  isCenterAligned!: boolean;
}
</script>
