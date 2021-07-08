<template>
  <div>
    <div class="d-flex">
      <div class="col-9 p-0 pr-2">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId" :imageHeight="topImageHeight"></PhotoInlineTextBottom>
      </div>
      <div class="col-3 p-0">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId" :imageHeight="topImageHeight"></PhotoInlineTextBottom>
      </div>
    </div>
    <div class="mt-2 d-flex">
      <div class="col-8 p-0 pr-2">
        <ThumbnailWithTextAtRightList :categoryId="thirdCategoryId"></ThumbnailWithTextAtRightList>
      </div>
      <div class="col-4 p-0">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId" :imageHeight="150"></PhotoInlineTextBottom>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithTextAtRightList from "./ThumbnailWithTextAtRightList.vue";
import PhotoInlineTextBottom from "./PhotoInlineTextBottom.vue";

@Component({
  components: {
    ThumbnailWithTextAtRightList,
    PhotoInlineTextBottom,
  },
})
export default class TwoPhotoTopThumbnailsWithTextAndPhotoBottom extends Vue {
  @Prop({ default: 255 }) topImageHeight!: number;
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop() thirdCategoryId!: string;
  @Prop() fourthCategoryId!: string;
}
</script>
