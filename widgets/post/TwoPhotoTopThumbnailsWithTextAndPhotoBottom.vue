<template>
  <div class="two-photo-top-thumbnails-with-text-and-photo-bottom">
    <div class="d-flex">
      <div class="col-9 p-0 pr-2">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId"></PhotoInlineTextBottom>
      </div>
      <div class="col-3 p-0">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId"></PhotoInlineTextBottom>
      </div>
    </div>
    <div class="mt-2 d-flex">
      <div class="col-8 p-0 pr-2">
        <ThumbnailWithTextAtRightList
          :categoryId="thirdCategoryId"
          :limit="textListLimit"
        ></ThumbnailWithTextAtRightList>
      </div>
      <div class="col-4 p-0">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId"></PhotoInlineTextBottom>
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
  @Prop({ default: 2 }) textListLimit!: number;
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop() thirdCategoryId!: string;
  @Prop() fourthCategoryId!: string;
}
</script>
