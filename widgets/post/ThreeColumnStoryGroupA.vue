<template>
  <div class="d-flex">
    <div class="w-33 mr-2">
      <PhotoTextBottomTopThumbnailTextListBottom
        :firstCategoryId="leftCategories[0]"
        :secondCategoryId="leftCategories[1]"
        :imageHeight="leftPhotoheight"
        :listLimit="3"
      >
      </PhotoTextBottomTopThumbnailTextListBottom>
    </div>
    <div class="w-33 mr-2">
      <ThumbnailWithTextListTopTextsBottom
        :firstCategoryId="centerCategories[0]"
        :secondCategoryId="centerCategories[1]"
      ></ThumbnailWithTextListTopTextsBottom>
    </div>
    <div class="w-33">
      <OneByOnePhotoTextBottom :categoryId="rightCategories[0]" :imageHeight="100"></OneByOnePhotoTextBottom>
      <div class="border-top border-bottom py-2">
        <PostsTitleList :categoryId="rightCategories[1]" :bulleted="true" :limit="2"></PostsTitleList>
        <ThumbnailWithTextAtRight :categoryId="rightCategories[2]" class="mt-2"></ThumbnailWithTextAtRight>
      </div>
      <OneByOnePhotoTextBottom
        class="d-flex mt-2"
        :categoryId="rightCategories[3]"
        :imageHeight="100"
        :isMultilineText="true"
      ></OneByOnePhotoTextBottom>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.w-33 {
  width: 33%;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoTextBottomTopThumbnailTextListBottom from "./PhotoTextBottomTopThumbnailTextListBottom.vue";
import ThumbnailWithTextListTopTextsBottom from "./ThumbnailWithTextListTopTextsBottom.vue";

import OneByOnePhotoTextBottom from "./OneByOnePhotoTextBottom.vue";
import PostsTitleList from "./PostsTitleList.vue";
import ThumbnailWithTextAtRight from "./ThumbnailWithTextAtRight.vue";

@Component({
  components: {
    PhotoTextBottomTopThumbnailTextListBottom,
    ThumbnailWithTextListTopTextsBottom,
    OneByOnePhotoTextBottom,
    PostsTitleList,
    ThumbnailWithTextAtRight,
  },
})
export default class ThreeColumnStoryGroupA extends Vue {
  @Prop({ default: () => [] }) leftCategories!: string[];
  @Prop({ default: 150 }) leftPhotoheight!: number;

  @Prop({ default: () => [] }) centerCategories!: string[];
  @Prop({ default: () => [] }) rightCategories!: string[];
}
</script>
