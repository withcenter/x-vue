<template>
  <div class="w-100">
    <form class="comment-form p-2 d-flex" @submit.prevent="onCommentSubmit">
      <div class="mr-2">
        <upload-button
          :size="35"
          @success="onFileUploaded"
          @progress="uploadProgress = $event"
        ></upload-button>
      </div>
      <textarea
        data-cy="comment-input"
        class="w-100 form-control"
        type="text"
        name="content"
        v-model="form.content"
        placeholder="Comment .."
        style="height: 40px"
      ></textarea>
      <div class="ml-2 d-flex" v-if="canSubmit || comment">
        <div v-if="comment || parent.idx != root.idx">
          <button
            class="btn btn-sm btn-danger h-100"
            type="button"
            @click="onClickCancel"
            v-if="!submitted"
          >
            Cancel
          </button>
        </div>
        <div v-if="!submitted && canSubmit">
          <button
            data-cy="comment-submit-button"
            class="w-100 ml-2 btn btn-sm btn-success h-100"
            type="submit"
          >
            Submit
          </button>
        </div>
        <div class="my-1 mx-2" v-if="submitted">
          <b-spinner type="grow" variant="success"></b-spinner>
        </div>
      </div>
    </form>
    <!-- upload progress bar -->
    <b-progress
      :value="uploadProgress"
      max="100"
      class="mb-3 ml-2 mr-3"
      v-if="uploadProgress"
    ></b-progress>
    <!-- file display -->
    <file-display
      :files="uploadedFiles"
      :showDelete="true"
      @file-deleted="onFileDeleted"
    ></file-display>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  CommentEditModel,
  CommentModel,
  FileModel,
  PostModel,
} from "@/x-vue/services/interfaces";
import UploadButton from "@/components/UploadButton.vue";
import FileDisplay from "@/x-vue/components/forum/FileDisplay.vue";
import { ApiService } from "@/x-vue/services/api.service";
import { addByComma, deleteByComma } from "../../services/functions";

@Component({
  props: ["root", "parent", "comment"],
  components: {
    UploadButton,
    FileDisplay,
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

  mounted(): void {
    if (this.comment) {
      this.form.idx = this.comment.idx;
      this.form.content = this.comment.content;
      this.form.files = this.comment.files
        .map((file) => `${file.idx}`)
        .join(",");

      this.uploadedFiles = this.comment.files;
    }
    // console.log(this.form);
  }

  async onCommentSubmit(): Promise<void> {
    if (this.submitted) return;
    this.submitted = true;
    this.form.rootIdx = this.root.idx;
    this.form.parentIdx = this.comment
      ? this.comment.parentIdx
      : this.parent.idx;
    // console.log(this.form);
    try {
      const res = await this.api.commentEdit(this.form);
      if (this.comment) {
        // comment update
        Object.assign(this.comment, res);
        this.comment.inEdit = false;
      } else {
        // comment create
        res.depth = (this.parent.depth ? +this.parent.depth + 1 : 1).toString();
        this.root.insertComment(res);
      }
      this.form.content = "";
      this.uploadedFiles = [];
      this.submitted = false;
    } catch (e) {
      this.api.error(e);
      this.submitted = false;
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
    this.form.files = addByComma(this.form.files, file.idx);
    this.uploadedFiles.push(file);
    this.uploadProgress = 0;
  }

  onFileDeleted(idx: string): void {
    this.form.files = deleteByComma(this.form.files, idx);
  }
}
</script>
