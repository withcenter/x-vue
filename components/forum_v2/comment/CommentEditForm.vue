<template>
  <div>
    <textarea></textarea>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

@Component({
  components: {},
})
export default class PostEditForm extends Vue {
  //   @Prop() forum!: ForumInterface;
  //   progress = 0;
  //   api = ApiService.instance;
  //   loading = false;
  //   mounted(): void {
  //     if (!this.forum) alert("[forum] is not binded.");
  //   }
  //   async onSubmit(): Promise<void> {
  //     console.log("post", this.forum.post.toJson);
  //     try {
  //       this.loading = true;
  //       // create or edit
  //       const post = await this.forum.post.edit();
  //       // Find post that was edited, and insert on top for new post or update the existing post.
  //       const i = this.forum.posts.findIndex((p) => p.idx == post.idx);
  //       if (i == -1) {
  //         this.forum.posts.splice(0, 0, post);
  //       } else {
  //         this.$set(this.forum.posts, i, post);
  //       }
  //       // Reset after create or edit
  //       this.forum.post = new PostModel();
  //       this.$emit("edited", post);
  //     } catch (e) {
  //       ComponentService.instance.error(e);
  //     }
  //     this.loading = false;
  //   }
  //   onFileUpload(file: FileModel): void {
  //     this.forum.post.fileIdxes = addByComma(this.forum.post.fileIdxes, file.idx);
  //     console.log("form file idxes;", this.forum.post.fileIdxes);
  //     this.forum.post.files.push(file);
  //     setTimeout(() => (this.progress = 0), 200);
  //   }
  //   onFileDelete(idx: string): void {
  //     const index = this.forum.post.files.findIndex((file) => file.idx == idx);
  //     console.log("index; ", index);
  //     this.forum.post.files.splice(index, 1);
  //     this.forum.post.fileIdxes = deleteByComma(this.forum.post.fileIdxes, idx);
  //   }
}
</script>
