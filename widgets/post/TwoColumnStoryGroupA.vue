<template>
  <div class="d-flex">
    <div class="col-8 p-0 pr-2">
      <TwoPhotoTopThumbnailsWithTextAndPhotoBottom
        :topImageHeight="215"
        :firstCategoryId="firstCategories[0]"
        :secondCategoryId="firstCategories[1]"
        :thirdCategoryId="firstCategories[2]"
        :fourthCategoryId="firstCategories[3]"
      ></TwoPhotoTopThumbnailsWithTextAndPhotoBottom>
    </div>
    <div class="col-4 p-0">
      <TextsTopThumbnailTextListBottom
        :firstCategoryId="secondCategories[0]"
        :secondCategoryId="secondCategories[1]"
        :firstLimit="7"
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
}
</script>
