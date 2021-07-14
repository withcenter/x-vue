<template>
  <div class="texts-top-thumbnail-text-list-bottom">
    <PostsTitleList
      class="border p-2"
      :categoryId="firstCategoryId"
      :limit="firstLimit"
      :bulleted="true"
    ></PostsTitleList>

    <ThumbnailWithTextAndMetaAtBottom class="mt-2" :categoryId="secondCategoryId"></ThumbnailWithTextAndMetaAtBottom>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PostsTitleList from "./PostsTitleList.vue";
import ThumbnailWithTextAndMetaAtBottom from "./ThumbnailWithTextAndMetaAtBottom.vue";

@Component({
  components: { PostsTitleList, ThumbnailWithTextAndMetaAtBottom },
})
export default class TextsTopThumbnailTextBottom extends Vue {
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop({ default: 8 }) firstLimit!: number;
}
</script>
