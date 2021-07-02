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
import { ForumInterface } from "@/x-vue/services/interfaces";
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
    /// Set categoryId. This must be here.
    this.forum.post.categoryId = this.forum.categoryId;
    console.log("post", this.forum.post.toJson);
    try {
      /// create or edit
      const post = await this.forum.post.edit();

      console.log("post; ", post);
      /// find post that was edited
      const i = this.forum.posts.findIndex((p) => {
        console.log("p.idx; ", p.idx, "post.idx;", post.idx);
        return p.idx == post.idx;
      });
      if (i == -1) {
        /// If it can't find, then it's a new post.
        this.forum.posts.splice(0, 0, post);
      } else {
        this.$set(this.forum.post, i, post);
      }
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
