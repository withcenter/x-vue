<template>
  <div class="d-flex">
    <div class="col-4 p-0 pr-2">
      <PhotoTextBottomTopThumbnailTextListBottom :listLimit="3"></PhotoTextBottomTopThumbnailTextListBottom>
    </div>
    <div class="col-4 p-0">
      <ThumbnailWithTextListTopTextsBottom></ThumbnailWithTextListTopTextsBottom>
    </div>
    <div class="col-4 p-0">
      <div class="d-flex border-bottom">
        <PhotoTextBottom class="p-0 mr-2" :imageHeight="100" :isMultiLine="false"></PhotoTextBottom>
        <PhotoTextBottom class="p-0" :imageHeight="100" :isMultiLine="false"></PhotoTextBottom>
      </div>
      <PostsTitleList class="mt-2" :bulleted="true" :limit="2"></PostsTitleList>
      <ThumbnailWithTextAtRight class="border-bottom mt-2 pb-1"></ThumbnailWithTextAtRight>
      <div class="d-flex mt-2">
        <PhotoTextBottom :imageHeight="100" class="mr-2"></PhotoTextBottom>
        <PhotoTextBottom :imageHeight="100"></PhotoTextBottom>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoTextBottomTopThumbnailTextListBottom from "./PhotoTextBottomTopThumbnailTextListBottom.vue";
import ThumbnailWithTextListTopTextsBottom from "./ThumbnailWithTextListTopTextsBottom.vue";

import PhotoTextBottom from "./PhotoTextBottom.vue";
import PostsTitleList from "./PostsTitleList.vue";
import ThumbnailWithTextAtRight from "./ThumbnailWithTextAtRight.vue";

@Component({
  components: {
    PhotoTextBottomTopThumbnailTextListBottom,
    ThumbnailWithTextListTopTextsBottom,
    PhotoTextBottom,
    PostsTitleList,
    ThumbnailWithTextAtRight,
  },
})
export default class ThreeColumnStoryGroupA extends Vue {
  @Prop({ default: () => [] }) firstCategories!: string[];
  @Prop({ default: () => [] }) secondCategories!: string[];
}
</script>
