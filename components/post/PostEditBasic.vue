<template>
  <div v-if="forum && forum.post && forum.post.inEdit">
    <form @submit.prevent="onSubmit">
      <PostEditTitle></PostEditTitle>
      <PostEditContent></PostEditContent>

      <div class="d-flex justify-content-between">
        <FileUploadButton
          @success="onFileUpload"
          @progress="progress = $event"
        ></FileUploadButton>

        <post-edit-submit></post-edit-submit>
      </div>
    </form>
    <b-progress
      :value="progress"
      max="100"
      class="mb-3"
      v-if="progress"
    ></b-progress>
    <FileEditList
      :files="forum.post.files"
      @deleted="onFileDelete"
    ></FileEditList>
  </div>
</template>

<script lang="ts">
import {
  FileModel,
  ForumInterface,
  PostModel,
} from "@/x-vue/services/interfaces";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import PostEditTitle from "./PostEditTitle.vue";
import PostEditContent from "./PostEditContent.vue";
import PostEditSubmit from "./PostEditSubmit.vue";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";
import FileUploadButton from "@/x-vue/components/file/FileUploadButton.vue";
import FileEditList from "@/x-vue/components/file/FileEditList.vue";
import { addByComma, deleteByComma } from "@/x-vue/services/functions";
@Component({
  components: {
    PostEditTitle,
    PostEditContent,
    PostEditSubmit,
    FileUploadButton,
    FileEditList,
  },
})
export default class PostEditBasic extends Vue {
  @Prop() forum!: ForumInterface;
  progress = 0;
  api = ApiService.instance;
  mounted() {
    if (!this.forum) alert("[forum] is not binded.");
  }
  async onSubmit(): Promise<void> {
    console.log("post", this.forum.post.toJson);
    try {
      // create or edit
      const post = await this.forum.post.edit();

      // Find post that was edited, and insert on top for new post or update the existing post.
      const i = this.forum.posts.findIndex((p) => p.idx == post.idx);
      if (i == -1) {
        this.forum.posts.splice(0, 0, post);
      } else {
        this.$set(this.forum.posts, i, post);
      }

      // Reset after create or edit
      this.forum.post = new PostModel();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }

  onFileUpload(file: FileModel): void {
    this.forum.post.fileIdxes = addByComma(this.forum.post.fileIdxes, file.idx);
    console.log("form file idxes;", this.forum.post.fileIdxes);
    this.forum.post.files.push(file);
    setTimeout(() => (this.progress = 0), 200);
  }

  onFileDelete(idx: string): void {
    const index = this.forum.post.files.findIndex((file) => file.idx == idx);
    console.log("index; ", index);
    this.forum.post.files.splice(index, 1);
    this.forum.post.fileIdxes = deleteByComma(this.forum.post.fileIdxes, idx);
  }
}
</script>
