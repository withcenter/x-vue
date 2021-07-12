<template>
  <div class="two-column-story-group-b row">
    <TitleContentPhotoTopAndTextListBottom
      :firstCategoryId="leftCategories[0]"
      :secondCategoryId="leftCategories[1]"
      class="left col-12 col-lg-6 pr-lg-1"
    ></TitleContentPhotoTopAndTextListBottom>
    <ThumbnailTextListTopTextMiddleTextsBottom
      :firstCategoryId="rightCategories[0]"
      :secondCategoryId="rightCategories[1]"
      :thirdCategoryId="rightCategories[2]"
      class="right col-12 col-lg-6 pl-lg-1 mt-lg-0 mt-2"
    ></ThumbnailTextListTopTextMiddleTextsBottom>
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
