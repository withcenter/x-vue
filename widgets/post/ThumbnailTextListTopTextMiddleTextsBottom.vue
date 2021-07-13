<template>
  <div class="thumbnail-text-list-top-text-middle-texts-bottom">
    <ThumbnailWithTextAtRightList
      class="top"
      :categoryId="firstCategoryId"
      :limit="topListLimit"
      :isMultiLine="true"
    ></ThumbnailWithTextAtRightList>
    <PostTitle
      class="middle mt-2 border-top border-bottom p-2 text-centered d-block"
      :categoryId="secondCategoryId"
    ></PostTitle>
    <div class="bottom mt-2">
      <div class="header py-2 px-2 d-inline-block">
        {{ thirdCategoryId || "Third Category" }}
        <div></div>
      </div>
      <PostsTitleList
        class="list"
        :categoryId="thirdCategoryId"
        :limit="bottomListLimit"
        :bulleted="true"
      ></PostsTitleList>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bottom {
  .header {
    color: white;
    background-color: rgb(42, 42, 248);

    div {
      border-top: rgb(42, 42, 248) 1px solid;
    }
  }

  .list {
    border-top: rgb(42, 42, 248) 1px solid;
    padding-top: 0.5em;
  }
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
