<template>
  <div class="two-photos-top-texts-midle-four-photos-bottom">
    <OneByOnePhotoInlineText></OneByOnePhotoInlineText>
    <PostsTitleList class="mt-2" :limit="listLimit"></PostsTitleList>
    <TwoByTwoPhotoTextBottom class="mt-2" :isMultilineText="false"></TwoByTwoPhotoTextBottom>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import OneByOnePhotoInlineText from "./OneByOnePhotoInlineText.vue";
import PostsTitleList from "./PostsTitleList.vue";
import TwoByTwoPhotoTextBottom from "./TwoByTwoPhotoTextBottom.vue";

@Component({
  components: {
    OneByOnePhotoInlineText,
    PostsTitleList,
    TwoByTwoPhotoTextBottom,
  },
})
export default class TwoPhotosTopTextsMiddleFourPhotosBottom extends Vue {
  @Prop() firstCategory!: string;
  @Prop() secondCategory!: string;
  @Prop() thirdCategory!: string;
  @Prop({ default: 3 }) listLimit!: number;
}
</script>
