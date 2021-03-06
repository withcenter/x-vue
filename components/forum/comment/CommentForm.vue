<template>
  <div class="w-100">
    <form class="comment-form p-2 d-flex" @submit.prevent="onCommentSubmit">
      <div class="mr-2">
        <upload-button :size="35" @success="onFileUploaded" @progress="uploadProgress = $event"></upload-button>
      </div>
      <b-form-textarea
        data-cy="comment-input"
        class="w-100 form-control"
        type="text"
        name="content"
        v-model="form.content"
        placeholder="Comment .."
        rows="1"
        max-rows="5"
      ></b-form-textarea>
      <div class="ml-2" v-if="canSubmit || comment">
        <div v-if="!submitted">
          <button class="w-100 mb-1 btn btn-sm btn-danger h-100" type="button" @click="onClickCancel" v-if="canCancel">
            {{ "cancel" | t }}
          </button>
          <button
            data-cy="comment-submit-button"
            class="w-100 btn btn-sm btn-success h-100"
            type="submit"
            v-if="canSubmit"
          >
            {{ "submit" | t }}
          </button>
        </div>
        <div class="my-1 mx-2" v-if="submitted">
          <b-spinner type="grow" variant="success"></b-spinner>
        </div>
      </div>
    </form>
    <!-- upload progress bar -->
    <b-progress :value="uploadProgress" max="100" class="mb-3 ml-2 mr-2" v-if="uploadProgress"></b-progress>
    <!-- file display -->
    <FileEditList :post="form" @deleted="onFileDeleted"></FileEditList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Service from "@/x-vue/services/component.service";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { addByComma, deleteByComma } from "@/x-vue/services/functions";
import { CommentEditModel, CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";

import UploadButton from "@/x-vue/components/UploadButton.vue";
import FileEditList from "@/x-vue/components/file/FileEditList.vue";

@Component({
  props: ["root", "parent", "comment"],
  components: {
    UploadButton,
    FileEditList,
  },
})
export default class CommentForm extends Vue {
  root!: PostModel;
  parent!: PostModel & CommentModel;
  comment!: CommentModel;
  form: CommentEditModel = new CommentEditModel();
  api = ApiService.instance;

  submitted = false;
  uploadProgress = 0;
  uploadedFiles: Array<FileModel> = [];

  get canSubmit(): boolean {
    if (this.uploadedFiles.length) return true;
    if (this.form.content.trim().length) return true;
    return false;
  }

  get canCancel(): boolean {
    if (this.comment) return true;
    if (this.parent.idx != this.root.idx) return true;
    if (this.submitted) return false;
    return false;
  }

  mounted(): void {
    if (this.comment) {
      this.form.idx = this.comment.idx;
      this.form.content = this.comment.content;
      this.form.files = this.comment.files;
      this.form.fileIdxes = this.comment.files.map((file) => `${file.idx}`).join(",");

      this.uploadedFiles = this.comment.files;
    }
    // console.log(this.form);
  }

  async onCommentSubmit(): Promise<void> {
    if (this.submitted) return;
    this.submitted = true;
    this.form.rootIdx = this.root.idx;
    this.form.parentIdx = this.comment ? this.comment.parentIdx : this.parent.idx;
    // console.log(this.form);
    try {
      const res = await this.api.commentEdit(this.form);
      if (this.comment) {
        // comment update
        res.depth = this.comment.depth;
        Object.assign(this.comment, res);
        this.comment.inEdit = false;
      } else {
        // comment create
        res.depth = this.parent.depth ? +this.parent.depth + 1 : 1;
        this.parent.inReply = false;
        this.root.insertComment(res);
      }

      this.form.content = "";
      this.uploadedFiles = [];
      this.submitted = false;

      this.$emit("edited", res);
    } catch (e) {
      this.submitted = false;
      Service.instance.error(e);
    }
  }

  onClickCancel(): void {
    if (this.comment) {
      this.comment.inEdit = false;
    } else {
      this.parent.inReply = false;
    }
  }

  onFileUploaded(file: FileModel): void {
    this.form.fileIdxes = addByComma(this.form.fileIdxes, file.idx);
    this.uploadedFiles.push(file);
    this.uploadProgress = 0;
  }

  onFileDeleted(idx: string): void {
    this.form.fileIdxes = deleteByComma(this.form.fileIdxes, idx);
  }
}
</script>
