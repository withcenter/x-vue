<template>
  <div>
    <form @submit.prevent="onSubmit" v-if="post">
      <post-edit-title></post-edit-title>
      <post-edit-content></post-edit-content>

      <div class="d-flex justify-content-between">
        <camera-svg style="width: 36px"></camera-svg>
        <post-edit-submit></post-edit-submit>
      </div>
    </form>

    <div class="alert alert-danger" v-if="!post">
      Developer mistake. The [post] property is not binded.
    </div>
  </div>
</template>



<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import PostEditTitle from "./PostEditTitle.vue";
import PostEditContent from "./PostEditContent.vue";
import PostEditSubmit from "./PostEditSubmit.vue";
import CameraSvg from "../../svg/CameraSvg.vue";
@Component({
  components: {
    PostEditTitle,
    PostEditContent,
    PostEditSubmit,
    CameraSvg,
  },
})
export default class PostEditBasic extends Vue {
  @Prop() post!: PostModel;
  onSubmit(): void {
    console.log("post", this.post.toJson);
  }
}
</script>
