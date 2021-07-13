<template>
  <div class="two-column-story-group-a container">
    <div class="row">
      <TwoPhotoTopThumbnailsWithTextAndPhotoBottom
        class="col-lg-8 col-12"
        :firstCategoryId="firstCategories[0]"
        :secondCategoryId="firstCategories[1]"
        :thirdCategoryId="firstCategories[2]"
        :fourthCategoryId="firstCategories[3]"
      ></TwoPhotoTopThumbnailsWithTextAndPhotoBottom>
      <TextsTopThumbnailTextListBottom
        class="col-lg-4 col-12 pl-lg-2 p-0 mt-lg-0 mt-2"
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

  @Prop({ default: 4 }) textListLimit!: number;
}
</script>
