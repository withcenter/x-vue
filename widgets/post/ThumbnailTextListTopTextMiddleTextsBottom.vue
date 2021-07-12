<template>
  <div class="thumbnail-text-list-top-text-middle-texts-bottom">
    <ThumbnailWithTextAtRightList
      :categoryId="firstCategoryId"
      :limit="topListLimit"
      :isMultiLine="true"
    ></ThumbnailWithTextAtRightList>
    <div class="mt-2 border-top border-bottom p-2 text-truncate text-centered">
      <b><PostTitle :categoryId="secondCategoryId"></PostTitle></b>
    </div>
    <div class="mt-2">
      <div class="third-category-header py-2 px-2 d-inline-block">
        <b>{{ thirdCategoryId || "Third Category" }}</b>
        <div></div>
      </div>
      <div class="bottom">
        <PostsTitleList :categoryId="thirdCategoryId" :limit="bottomListLimit" :bulleted="true"></PostsTitleList>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.third-category-header {
  color: white;
  background-color: rgb(42, 42, 248);

  div {
    border-top: rgb(42, 42, 248) 1px solid;
  }
}

.bottom {
  border-top: rgb(42, 42, 248) 1px solid;
  padding-top: 0.5em;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithTextAtRightList from "./ThumbnailWithTextAtRightList.vue";
import PostTitle from "./PostTitle.vue";
import PostsTitleList from "./PostsTitleList.vue";

@Component({
  components: { ThumbnailWithTextAtRightList, PostTitle, PostsTitleList },
})
export default class ThumbnailTextListTopTextMiddleTextsBottom extends Vue {
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop() thirdCategoryId!: string;
  @Prop({ default: 3 }) topListLimit!: number;
  @Prop({ default: 5 }) bottomListLimit!: number;
}
</script>
