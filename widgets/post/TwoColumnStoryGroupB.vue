<template>
  <div class="d-flex">
    <TitleContentPhotoTopAndTextListBottom class="left mr-2"></TitleContentPhotoTopAndTextListBottom>
    <ThumbnailTextListTopTextMiddleTextsBottom class="right"></ThumbnailTextListTopTextMiddleTextsBottom>
  </div>
</template>

<style lang="scss" scoped>
.left {
  width: 60%;
}
.right {
  width: 40%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailTextListTopTextMiddleTextsBottom from "./ThumbnailTextListTopTextMiddleTextsBottom.vue";
import TitleContentPhotoTopAndTextListBottom from "./TitleContentPhotoTopAndTextListBottom.vue";

@Component({
  components: { ThumbnailTextListTopTextMiddleTextsBottom, TitleContentPhotoTopAndTextListBottom },
})
export default class TwoColumnStoryGroupB extends Vue {
  @Prop({ default: () => [] })
  leftCategories!: string[];

  @Prop({ default: () => [] })
  rightCategories!: string[];
}
</script>
