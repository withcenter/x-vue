<template>
  <div class="d-flex">
    <PhotoWithTextsAtBottom
      class="mr-1 w-50"
      :categoryId="firstCategoryId"
      :limit="limit"
      :imageHeight="imageHeight"
    ></PhotoWithTextsAtBottom>
    <PhotoWithTextsAtBottom
      class="w-50"
      :categoryId="firstCategoryId"
      :limit="limit"
      :imageHeight="imageHeight"
    ></PhotoWithTextsAtBottom>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoWithTextsAtBottom from "./PhotoWithTextsAtBottom.vue";

@Component({
  components: { PhotoWithTextsAtBottom },
})
export default class OneByOnePhotoWithTextsAtBottom extends Vue {
  @Prop()
  firstCategoryId!: string;
  @Prop()
  secondCategoryId!: string;
  @Prop({
    default: 5,
  })
  limit!: string;
  @Prop({
    default: 200,
  })
  imageHeight!: string;
}
</script>
