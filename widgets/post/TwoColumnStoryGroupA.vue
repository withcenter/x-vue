<template>
  <div class="d-flex">
    <div class="col-8 p-0 pr-2">
      <TwoPhotoTopThumbnailsWithTextAndPhotoBottom
        :topImageHeight="255"
        :firstCategoryId="categories[0]"
        :secondCategoryId="categories[1]"
        :thirdCategoryId="categories[2]"
        :fourthCategoryId="categories[3]"
      ></TwoPhotoTopThumbnailsWithTextAndPhotoBottom>
    </div>
    <div class="col-4 p-0">
      <TextsTopTwoThumbnailTextBottom
        :firstCategoryId="categories[4]"
        :secondCategoryId="categories[5]"
        :firstLimit="8"
      ></TextsTopTwoThumbnailTextBottom>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import TwoPhotoTopThumbnailsWithTextAndPhotoBottom from "./TwoPhotoTopThumbnailsWithTextAndPhotoBottom.vue";
import TextsTopTwoThumbnailTextBottom from "./TextsTopThumbnailTextListBottom.vue";

@Component({
  components: { TwoPhotoTopThumbnailsWithTextAndPhotoBottom, TextsTopTwoThumbnailTextBottom },
})
export default class TwoColumnStoryGroupA extends Vue {
  @Prop({ default: () => [] }) categories!: string[];
}
</script>
