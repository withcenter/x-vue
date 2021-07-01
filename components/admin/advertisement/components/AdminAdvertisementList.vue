<template>
  <div class="admin-advertisement-list">
    <div class="mt-3" v-if="advertisements.length">
      <div
        class="box d-flex p-2 mb-2"
        v-for="advertisement of advertisements"
        :key="advertisement.idx"
      >
        <router-link
          class="w-100"
          :to="`/advertisement/view/${advertisement.idx}`"
        >
          <advertisement-preview
            :advertisement="advertisement"
          ></advertisement-preview>
        </router-link>
        <div class="ml-1 px-2 text-center border-left">
          <b-avatar
            tabindex="0"
            class="center"
            :src="advertisement.user.src"
            :size="'4em'"
          ></b-avatar>
          <div class="w-100 text-truncate">
            {{ advertisement.user.displayName }}
          </div>
        </div>
      </div>
    </div>
    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Loading Advertisements ...
    </div>
    <div class="d-flex overflow-auto justify-content-center">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="noOfPages"
        v-model="options.page"
        v-on:change="onPageChanged"
        use-router
      ></b-pagination-nav>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Service from "@/x-vue/services/x-vue.service";
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementModel, RequestData } from "@/x-vue/services/interfaces";
import AdvertisementPreview from "@/x-vue/components/advertisement/AdvertisementPreview.vue";

@Component({
  components: {
    AdvertisementPreview,
  },
})
export default class AdminAdvertisementList extends Vue {
  api = ApiService.instance;

  loading = false;
  advertisements: AdvertisementModel[] = [];

  total = 0;
  limit = 10;
  noOfPages = 10;

  options: RequestData = {};

  async mounted(): Promise<void> {
    this.options.limit = this.limit;
    this.options.categoryId = "advertisement";
    this.options.page = (this.$route.query.page as string) ?? "1";

    try {
      await this.loadAdvertisements();
      this.total = await this.api.postCount(this.options);
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      Service.instance.error(e);
    }
  }

  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    this.options.page = page;
    this.loadAdvertisements();
  }

  async loadAdvertisements(): Promise<void> {
    this.loading = true;
    try {
      this.advertisements = await this.api.advertisementSearch(this.options);
      // console.log(this.posts);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      Service.instance.error(e);
    }
  }
}
</script>
