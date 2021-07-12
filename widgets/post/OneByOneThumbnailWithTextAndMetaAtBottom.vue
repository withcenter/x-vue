<template>
  <div class="one-by-one-thumbnail-with-text-and-meta-at-bottom d-flex">
    <ThumbnailWithTextAndMetaAtBottom
      class="mr-2 w-50"
      :categoryId="firstCategoryId"
      :imageHeight="imageHeight"
    ></ThumbnailWithTextAndMetaAtBottom>
    <ThumbnailWithTextAndMetaAtBottom
      class="w-50"
      :categoryId="firstCategoryId"
      :imageHeight="imageHeight"
    ></ThumbnailWithTextAndMetaAtBottom>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import ThumbnailWithTextAndMetaAtBottom from "./ThumbnailWithTextAndMetaAtBottom.vue";

@Component({
  components: { ThumbnailWithTextAndMetaAtBottom },
})
export default class OneByOneThumbnailWithTextAndMetaAtBottom extends Vue {
  @Prop()
  firstCategoryId!: string;
  @Prop()
  secondCategoryId!: string;

  @Prop({ default: 5 })
  limit!: string;
  @Prop({ default: 200 })
  imageHeight!: string;
}
</script>
