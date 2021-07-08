<template>
  <div>
    <PhotoTextBottom :categoryId="firstCategoryId"></PhotoTextBottom>
    <ThumbnailWithTextAtRightList
      class="mt-2"
      :isMultiLine="true"
      :categoryId="secondCategoryId"
      :limit="secondLimit"
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
  @Prop({ default: 7 })
  secondLimit!: number;
}
</script>
