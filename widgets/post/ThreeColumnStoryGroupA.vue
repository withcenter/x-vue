<template>
  <div class="container">
    <div class="row">
      <PhotoTextBottomTopThumbnailTextListBottom
        class="col-lg-4 p-0 col-12 pr-lg-1"
        :firstCategoryId="leftCategories[0]"
        :secondCategoryId="leftCategories[1]"
        :listLimit="3"
      >
      </PhotoTextBottomTopThumbnailTextListBottom>
      <ThumbnailWithTextListTopTextsBottom
        class="col-lg-4 p-0 col-12 px-lg-1 mt-2 mt-lg-0"
        :firstCategoryId="centerCategories[0]"
        :secondCategoryId="centerCategories[1]"
      ></ThumbnailWithTextListTopTextsBottom>
      <div class="col-lg-4 p-0 col-12 pl-lg-1 mt-2 mt-lg-0">
        <OneByOnePhotoTextBottom :categoryId="rightCategories[0]"></OneByOnePhotoTextBottom>
        <div class="border-top border-bottom py-2">
          <PostsTitleList :categoryId="rightCategories[1]" :bulleted="true" :limit="2"></PostsTitleList>
          <ThumbnailWithTextAtRight :categoryId="rightCategories[2]" class="mt-2"></ThumbnailWithTextAtRight>
        </div>
        <OneByOnePhotoTextBottom
          class="d-flex p-0 mt-2"
          :categoryId="rightCategories[3]"
          :isMultilineText="true"
        ></OneByOnePhotoTextBottom>
      </div>
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

  @Prop({ default: () => [] }) centerCategories!: string[];
  @Prop({ default: () => [] }) rightCategories!: string[];
}
</script>
