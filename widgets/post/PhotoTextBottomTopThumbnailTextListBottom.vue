<template>
  <div>
    <PhotoTextBottom :imageHeight="imageHeight" :categoryId="firstCategoryId"></PhotoTextBottom>
    <ThumbnailWithTextAtRightList
      class="mt-3"
      :isMultiLine="true"
      :categoryId="secondCategoryId"
      :limit="listLimit"
      :isTextCentered="false"
    ></ThumbnailWithTextAtRightList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoTextBottom from "./PhotoTextBottom.vue";
import ThumbnailWithTextAtRightList from "./ThumbnailWithTextAtRightList.vue";

@Component({
  components: { PhotoTextBottom, ThumbnailWithTextAtRightList },
})
export default class PhotoTextBottomTopThumbnailTextListBottom extends Vue {
  @Prop() firstCategoryId!: string;

  @Prop() secondCategoryId!: string;
  @Prop({ default: 150 }) imageHeight!: number;
  @Prop({ default: 7 }) listLimit!: number;
}
</script>
