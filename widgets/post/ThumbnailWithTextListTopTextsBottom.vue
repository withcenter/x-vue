<template>
  <div class="thumbnail-with-text-list-top-texts-bottom">
    <ThumbnailWithTextAtRightList
      :isMultiLine="true"
      :categoryId="firstCategoryId"
      :limit="firstLimit"
      :isTextCentered="false"
    ></ThumbnailWithTextAtRightList>
    <PostsTitleList class="mt-2" :categoryId="secondCategoryId" :limit="secondLimit" :bulleted="true"></PostsTitleList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithTextAtRightList from "./ThumbnailWithTextAtRightList.vue";
import PostsTitleList from "./PostsTitleList.vue";

@Component({
  components: {
    ThumbnailWithTextAtRightList,
    PostsTitleList,
  },
})
export default class ThumbnailWithTextListTopTextsBottom extends Vue {
  @Prop() firstCategoryId!: string;
  @Prop({ default: 3 })
  firstLimit!: number;

  @Prop() secondCategoryId!: string;
  @Prop({ default: 8 })
  secondLimit!: number;
}
</script>
