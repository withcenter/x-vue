<template>
  <div v-if="forum && forum.post && forum.post.inEdit">
    <form @submit.prevent="onSubmit">
      <PostEditTitle></PostEditTitle>
      <PostEditContent></PostEditContent>

      <div class="d-flex justify-content-between">
        <FileUploadButton :post="forum.post" @uploaded="onFileUpload" @progress="progress = $event"></FileUploadButton>
        <div class="d-flex">
          <button class="btn btn-secondary mr-2" @click="onCancel">Cancel</button>
          <PostEditSubmitButton :loading="loading"></PostEditSubmitButton>
        </div>
      </div>
    </form>
    <b-progress :value="progress" max="100" class="mb-3" v-if="progress"></b-progress>
    <FileEditList :post="forum.post"></FileEditList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import PostEditTitle from "./PostEditTitle.vue";
import PostEditContent from "./PostEditContent.vue";
import PostEditSubmitButton from "./PostEditSubmitButton.vue";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";
import FileUploadButton from "@/x-vue/components/file/FileUploadButton.vue";
import FileEditList from "@/x-vue/components/file/FileEditList.vue";
import { ForumInterface, PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    PostEditTitle,
    PostEditContent,
    PostEditSubmitButton,
    FileUploadButton,
    FileEditList,
  },
})
export default class PostEditForm extends Vue {
  @Prop() forum!: ForumInterface;
  progress = 0;
  api = ApiService.instance;
  loading = false;

  mounted(): void {
    if (!this.forum) alert("[forum] is not binded.");
    // autosize();
    // autosize
  }
  async onSubmit(): Promise<void> {
    if (this.loading) return;
    console.log("post", this.forum.post.toJson);
    try {
      this.loading = true;
      // create or edit
      const post = await this.forum.post.edit();

      // Find post that was edited, and insert on top for new post or update the existing post.
      const i = this.forum.posts.findIndex((p) => p.idx == post.idx);
      if (i == -1) {
        // Post created
        this.forum.posts.splice(0, 0, post);
        // 새 글을 작성한 경우, 다음 페이지를 가져 올 때, 맨 마지막 글이 다시 서버로 부터 전달되어 오는데,
        // 글 목록에서 해당 글이 존재하는지 확인해서 없애면 너무 무리가 가서, 여기서 현재 글 목록 중 마지막 글을 없앤다.
        this.forum.posts.splice(-1, 1);
      } else {
        this.$set(this.forum.posts, i, post);
      }

      // Reset after create or edit
      this.forum.post = new PostModel();
      this.$emit("edited", post);
    } catch (e) {
      ComponentService.instance.error(e);
    }
    this.loading = false;
  }
  onFileUpload(): void {
    setTimeout(() => (this.progress = 0), 200);
  }
  onCancel(): void {
    this.forum.post.inEdit = false;
    this.$emit("cancelled", this.forum.post);
  }
}
</script>
