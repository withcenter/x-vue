<template>
  <div v-if="advertisement">
    <article data-cy="advertisement-view" class="post-view px-2 py-4">
      <!-- title -->
      <h3 id="post-title">{{ advertisement.title }}</h3>
      <!-- content image -->
      <img class="mt-3 w-100" :src="contentBanner.url" v-if="contentBanner" />
      <!-- content -->
      <div id="post-content" class="mt-3 p-2 rounded" style="background-color: #f1f1f1" v-if="!advertisement.deletedAt">
        {{ advertisement.content }}
      </div>
      <hr class="my-3" />
      <!-- buttons -->
      <div class="d-flex" v-if="api.isMine(advertisement)">
        <span class="flex-grow-1"></span>
        <router-link class="btn btn-success" :to="'/advertisement/edit/' + advertisement.idx">
          {{ "edit" | t }}
        </router-link>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { FileModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import Component from "vue-class-component";
import Vue from "vue";
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";

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
