<template>
  <section class="post">
    <div v-if="api._user.loggedIn">
      <div v-if="form.categoryId">
        {{ "category" | t }}
        <span class="text-uppercase">
          {{ form.categoryId }}
        </span>
      </div>
      <form class="mt-3" @submit.prevent="onSubmit">
        {{ "title" | t }}
        <div class="form-group">
          <input class="w-100 form-control" v-model="form.title" type="text" name="title" />
        </div>
        {{ "content" | t }}
        <div class="form-group">
          <textarea class="w-100 form-control" v-model="form.content" type="text" name="content" />
        </div>
        <div class="d-flex align-center">
          <upload-button @success="onFileUploaded" @progress="uploadProgress = $event"></upload-button>
          <span class="flex-grow-1 mt-2 mr-2">
            <b-progress :value="uploadProgress" max="100" class="mb-3" v-if="uploadProgress"></b-progress>
          </span>
          <button type="submit" class="btn btn-success" v-if="!submitted">
            {{ "submit" | t }}
          </button>
          <b-spinner class="mx-2" type="grow" variant="success" v-if="submitted"></b-spinner>
        </div>
        <!-- file display -->
        <file-display :files="form.files" :showDelete="true" @file-deleted="onFileDeleted"></file-display>
      </form>
    </div>
    <login-first v-if="!loading"></login-first>
    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Please wait while loading the post ...
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { ApiService } from "@/x-vue/services/api.service";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import { addByComma, deleteByComma } from "@/x-vue/services/functions";

import ComponentService from "@/x-vue/services/x-vue.service";
import UploadButton from "@/x-vue/components/UploadButton.vue";
import LoginFirst from "@/x-vue/components/user/LoginFirst.vue";
import FileDisplay from "@/x-vue/components/forum/FileDisplay.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  components: {
    LoginFirst,
    UploadButton,
    FileDisplay,
  },
})
export default class PostEdit extends Vue {
  form: PostModel = new PostModel();
  api = ApiService.instance;

  loading = false;
  submitted = false;
  uploadProgress = 0;

  mounted(): void {
    const idxOrCategory = this.$route.params.idxOrCategory;
    if (isNaN(parseInt(idxOrCategory))) {
      this.form.categoryId = idxOrCategory;

      // add subcategory if it exist on route.query
      if (this.$route.query.sc) {
        this.form.subcategory = this.$route.query.sc as string;
      }
    } else {
      this.form.idx = parseInt(idxOrCategory);
      this.loadPost();
    }
    console.log("PostEdit::mounted", this.form);
  }

  async loadPost(): Promise<void> {
    this.loading = true;
    try {
      this.form = await this.api.postGet({ idx: this.form.idx });
      this.loading = false;
    } catch (e) {
      ComponentService.instance.error(e);
      this.loading = false;
    }
    // console.log("Update form: ", this.form);
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    try {
      const res = await this.api.postEdit(this.form.toJson);
      let link = `/${res.path}` + location.search;
      ComponentService.instance.open(link);
      this.submitted = false;
      this.$emit("edited");
    } catch (e) {
      ComponentService.instance.error(e);
      this.submitted = false;
    }
  }

  onFileUploaded(file: FileModel): void {
    this.form.fileIdxes = addByComma(this.form.fileIdxes, file.idx);
    // console.log("form file idxes", this.form);
    this.form.files.push(file);
    this.uploadProgress = 0;
  }

  onFileDeleted(idx: string): void {
    this.form.fileIdxes = deleteByComma(this.form.fileIdxes, idx);
  }
}
</script>
