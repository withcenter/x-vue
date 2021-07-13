<template>
  <div class="two-photo-top-thumbnails-with-text-and-photo-bottom container">
    <div class="row">
      <div class="col-9 p-0 pr-2">
        <PhotoInlineTextBottom :categoryId="firstCategoryId"></PhotoInlineTextBottom>
      </div>
      <div class="col-3 p-0">
        <PhotoInlineTextBottom :categoryId="secondCategoryId"></PhotoInlineTextBottom>
      </div>
    </div>
    <div class="mt-2 row">
      <div class="col-9 p-0 pr-2">
        <ThumbnailWithTextAndMetaList
          :categoryId="thirdCategoryId"
          :limit="textListLimit"
        ></ThumbnailWithTextAndMetaList>
      </div>
      <div class="col-3 p-0">
        <PhotoInlineTextBottom :categoryId="fourthCategoryId"></PhotoInlineTextBottom>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithTextAndMetaList from "./ThumbnailWithTextAndMetaList.vue";
import PhotoInlineTextBottom from "./PhotoInlineTextBottom.vue";

@Component({
  components: {
    ThumbnailWithTextAndMetaList,
    PhotoInlineTextBottom,
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
