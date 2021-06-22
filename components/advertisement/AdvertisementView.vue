<template>
  <div v-if="advertisement">
    <article data-cy="advertisement-view" class="post-view px-2 py-4">
      <!-- content image -->
      <img class="w-100" :src="contentBanner.url" v-if="contentBanner" />
      <!-- title -->
      <h3 class="mt-2" id="post-title">{{ advertisement.title }}</h3>
      <!-- content -->
      <div
        id="post-content"
        class="mt-3 p-2 rounded"
        style="background-color: #f1f1f1"
        v-if="!advertisement.deletedAt"
      >
        {{ advertisement.content }}
      </div>
      <hr class="my-3" />
      <!-- buttons -->
      <div class="d-flex" v-if="api.isMine(advertisement)">
        <span class="flex-grow-1"></span>
        <router-link
          class="btn btn-success"
          :to="'/advertisement/edit/' + advertisement.idx"
        >
          {{ "edit" | t }}
        </router-link>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { AdvertisementModel, FileModel } from "@/x-vue/services/interfaces";
import Component from "vue-class-component";
import Vue from "vue";
import { ApiService } from "@/x-vue/services/api.service";

@Component({
  props: ["advertisement"],
})
export default class AdvertisementView extends Vue {
  advertisement!: AdvertisementModel;

  api = ApiService.instance;

  get contentBanner(): FileModel {
    return this.advertisement.files.filter((f) => f.code == "content")[0];
  }
}
</script>
