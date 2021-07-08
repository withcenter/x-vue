<template>
  <div>
    <div class="border px-2">
      <PostsTitleList :categoryId="firstCategoryId" :limit="firstLimit" :bulleted="true"></PostsTitleList>
    </div>
    <ThumbnailWithTextAtRightList
      class="mt-2"
      :categoryId="secondCategoryId"
      :limit="secondLimit"
    ></ThumbnailWithTextAtRightList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PostsTitleList from "./PostsTitleList.vue";
import ThumbnailWithTextAtRightList from "./ThumbnailWithTextAtRightList.vue";

@Component({
  components: { PostsTitleList, ThumbnailWithTextAtRightList },
})
export default class TextsTopThumbnailTextListBottom extends Vue {
  @Prop()
  firstCategoryId!: string;
  @Prop()
  secondCategoryId!: string;
  @Prop({ default: 7 })
  firstLimit!: number;
  @Prop({ default: 2 })
  secondLimit!: number;
}
</script>
