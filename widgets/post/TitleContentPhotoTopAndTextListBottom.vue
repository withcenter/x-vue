<template>
  <div>
    <TitleAndContentTopPhotoBottom
      :categoryId="firstCategoryId"
      :imageHeight="imageHeight"
    ></TitleAndContentTopPhotoBottom>
    <PostsTitleList class="mt-2" :categoryId="secondCategoryId" :limit="bottomListLimit"></PostsTitleList>
  </div>
</template>

<style lang="scss" scoped>
.third-category-header {
  color: white;
  background-color: rgb(42, 42, 248);
}

.bottom {
  border-top: rgb(42, 42, 248) 1px solid;
  padding-top: 0.25em;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PostsTitleList from "./PostsTitleList.vue";
import TitleAndContentTopPhotoBottom from "./TitleAndContentTopPhotoBottom.vue";

@Component({
  components: { TitleAndContentTopPhotoBottom, PostsTitleList },
})
export default class TitleContentPhotoTopAndTextListBottom extends Vue {
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop({ default: 3 }) bottomListLimit!: number;
  @Prop({ default: 208 }) imageHeight!: number;
}
</script>
