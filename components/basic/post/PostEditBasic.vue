<template>
  <div v-if="forum && forum.post && forum.post.inEdit">
    <form @submit.prevent="onSubmit">
      <PostEditTitle></PostEditTitle>
      <PostEditContent></PostEditContent>

      <div class="d-flex justify-content-between">
        <camera-svg style="width: 36px"></camera-svg>
        <post-edit-submit></post-edit-submit>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ForumInterface, PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import PostEditTitle from "./PostEditTitle.vue";
import PostEditContent from "./PostEditContent.vue";
import PostEditSubmit from "./PostEditSubmit.vue";
import CameraSvg from "../../svg/CameraSvg.vue";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";
@Component({
  components: {
    PostEditTitle,
    PostEditContent,
    PostEditSubmit,
    CameraSvg,
  },
})
export default class PostEditBasic extends Vue {
  @Prop() forum!: ForumInterface;
  api = ApiService.instance;
  mounted() {
    console.log("forum; ", this.forum);
    if (!this.forum) alert("[forum] is not binded.");
  }
  async onSubmit(): Promise<void> {
    console.log("post", this.forum.post.toJson);
    try {
      const res = this.forum.post.edit();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
