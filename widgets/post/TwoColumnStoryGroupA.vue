<template>
  <div class="two-column-story-group-a row">
    <div class="col-lg-8 col-12 pr-lg-2">
      <TwoPhotoTopThumbnailsWithTextAndPhotoBottom
        :firstCategoryId="firstCategories[0]"
        :secondCategoryId="firstCategories[1]"
        :thirdCategoryId="firstCategories[2]"
        :fourthCategoryId="firstCategories[3]"
      ></TwoPhotoTopThumbnailsWithTextAndPhotoBottom>
    </div>
    <div class="col-lg-4 col-12 mt-lg-0 mt-2">
      <TextsTopThumbnailTextListBottom
        :firstCategoryId="secondCategories[0]"
        :secondCategoryId="secondCategories[1]"
        :firstLimit="textListLimit"
      ></TextsTopThumbnailTextListBottom>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import TwoPhotoTopThumbnailsWithTextAndPhotoBottom from "./TwoPhotoTopThumbnailsWithTextAndPhotoBottom.vue";
import TextsTopThumbnailTextListBottom from "./TextsTopThumbnailTextListBottom.vue";

@Component({
  components: { TwoPhotoTopThumbnailsWithTextAndPhotoBottom, TextsTopThumbnailTextListBottom },
})
export default class TwoColumnStoryGroupA extends Vue {
  @Prop({ default: () => [] }) firstCategories!: string[];
  @Prop({ default: () => [] }) secondCategories!: string[];

  @Prop({ default: 5 }) textListLimit!: number;
}
</script>
