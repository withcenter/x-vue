<template>
  <div class="texts-top-thumbnail-text-list-bottom">
    <PostsTitleList
      class="border p-2"
      :categoryId="firstCategoryId"
      :limit="firstLimit"
      :bulleted="true"
    ></PostsTitleList>

    <ThumbnailWithTextAndMetaList
      class="mt-2"
      :categoryId="secondCategoryId"
      :limit="secondLimit"
    ></ThumbnailWithTextAndMetaList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PostsTitleList from "./PostsTitleList.vue";
import ThumbnailWithTextAndMetaList from "./ThumbnailWithTextAndMetaList.vue";

@Component({
  components: { PostsTitleList, ThumbnailWithTextAndMetaList },
})
export default class TextsTopThumbnailTextListBottom extends Vue {
  @Prop() firstCategoryId!: string;
  @Prop() secondCategoryId!: string;
  @Prop({ default: 8 }) firstLimit!: number;
  @Prop({ default: 2 }) secondLimit!: number;
}
</script>
