<template>
  <section>
    <div class="d-flex align-items-center mt-2 form">
      <FileUploadButton :post="comment" @uploaded="onFileUpload" @progress="progress = $event"></FileUploadButton>
      <textarea ref="textarea" v-model="comment.content"></textarea>
      <button class="btn btn-primary" @click="onSubmit" v-if="!loading">Submit</button>
      <b-spinner class="mx-2" type="grow" variant="success" v-if="loading"></b-spinner>
    </div>

    <b-progress :value="progress" max="100" class="mb-3" v-if="progress"></b-progress>
    <FileEditList :post="comment"></FileEditList>
  </section>
</template>
<style lang="scss" scoped>
.form {
  textarea {
    margin-left: 0.25em;
    padding: 0.25em;
    width: 100%;
    height: 2.25em;
  }
  button {
    margin-left: 0.25em;
  }
}
</style>
<script lang="ts">
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import FileUploadButton from "@/x-vue/components/file/FileUploadButton.vue";
import FileEditList from "@/x-vue/components/file/FileEditList.vue";

import autosize from "autosize";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";

@Component({
  components: {
    FileUploadButton,
    FileEditList,
  },
})
export default class extends Vue {
  @Prop() post!: PostModel;
  @Prop() parent!: PostModel | CommentModel;
  @Prop({ default: () => new CommentModel() }) comment!: CommentModel;
  $refs!: {
    textarea: HTMLInputElement;
  };
  progress = 0;
  loading = false;
  mounted(): void {
    autosize(this.$refs.textarea);
  }
  onFileUpload(): void {
    setTimeout(() => (this.progress = 0), 200);
  }

  async onSubmit(): Promise<void> {
    if (this.loading) return;
    this.loading = true;

    console.log("this.post;", this.post);
    console.log("this.parent;", this.parent);

    // rootIdx
    this.comment.rootIdx = this.post.idx;

    // update parentIdx on create
    if (this.comment.parentIdx == 0) {
      this.comment.parentIdx = this.parent.idx;
    }

    try {
      // create or update the comment.
      const edited = await ApiService.instance.commentEdit(this.comment.toJsonEdit);
      if (this.comment.idx) {
        // if comment updated, copy updated data to original comment. and close the form.
        const depth = this.comment.depth;
        this.comment.copyWith(edited);
        this.comment.depth = depth;
        this.comment.inEdit = false;
      } else {
        // if a comment was created, insert right below the parent and close the form.
        edited.depth = this.parent.depth ? +this.parent.depth + 1 : 1;
        this.post.insertComment(edited);
        this.parent.inReply = false;
      }
      this.$emit("edited", edited);
    } catch (e) {
      ComponentService.instance.error(e);
    }

    this.loading = false;
  }
}
</script>
