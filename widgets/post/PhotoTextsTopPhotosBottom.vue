<template>
  <div class="photo-texts-top-photos-bottom">
    <PhotoWithTextsAtRight :categoryId="categoryIdTop"></PhotoWithTextsAtRight>
    <FourPhotosWithTextBottom class="mt-2" :categoryId="categoryIdBottom"></FourPhotosWithTextBottom>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import PhotoWithTextsAtRight from "./PhotoWithTextsAtRight.vue";
import FourPhotosWithTextBottom from "./FourPhotosWithTextBottom.vue";

@Component({
  components: { PhotoWithTextsAtRight, FourPhotosWithTextBottom },
})
export default class PhotoTextsTopPhotosBottom extends Vue {
  @Prop({}) categoryIdTop!: string;
  @Prop({}) categoryIdBottom!: string;
}
</script>
