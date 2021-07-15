<template>
  <div class="two-photo-top-thumbnails-with-text-and-photo-bottom container">
    <div class="top row">
      <div class="col-9 p-0 pr-2">
        <PhotoInlineTextBottom :categoryId="firstCategoryId"></PhotoInlineTextBottom>
      </div>
      <div class="col-3 p-0">
        <PhotoInlineTextBottom :categoryId="secondCategoryId"></PhotoInlineTextBottom>
      </div>
    </div>
    <div class="bottom mt-2 row">
      <div class="col-9 p-0 pr-2">
        <ThumbnailWithTextAndMetaList
          :categoryId="thirdCategoryId"
          :limit="textListLimit"
        ></ThumbnailWithTextAndMetaList>
      </div>
      <PhotoInlineTextBottomList class="col-3 p-0" :categoryId="fourthCategoryId"></PhotoInlineTextBottomList>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithTextAndMetaList from "./ThumbnailWithTextAndMetaList.vue";
import PhotoInlineTextBottom from "./PhotoInlineTextBottom.vue";
import PhotoInlineTextBottomList from "./PhotoInlineTextBottomList.vue";

@Component({
  components: {
    ThumbnailWithTextAndMetaList,
    PhotoInlineTextBottom,
    PhotoInlineTextBottomList,
  },
})
export default class TwoPhotoTopThumbnailsWithTextAndPhotoBottom extends Vue {
  @Prop({ default: 2 }) textListLimit!: number;
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop() thirdCategoryId!: string;
  @Prop() fourthCategoryId!: string;
}
</script>
