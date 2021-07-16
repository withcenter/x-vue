<template>
  <section data-cy="advertisement-list-page" class="advertisement-list-page">
    <login-first class="mt-2"></login-first>

    <div v-if="api._user.loggedIn">
      <div class="mt-3" v-if="posts.length">
        <div class="box p-2 mb-2" v-for="post of posts" :key="post.idx">
          <router-link :to="`/advertisement/edit/${post.idx}`">
            <AdvertisementPreview :advertisement="post"></AdvertisementPreview>
          </router-link>
        </div>
      </div>
      <div class="mt-3 p-2 text-center" v-if="!posts.length && !loading">No Advertisements ..</div>
      <div class="p-3 text-center rounded" v-if="loading">
        <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
        Loading Advertisements ...
      </div>
      <div class="d-flex mt-3 justify-content-center w-100" v-if="posts.length">
        <div class="overflow-auto">
          <b-pagination-nav
            :link-gen="linkGen"
            :number-of-pages="noOfPages"
            v-model="currentPage"
            v-on:change="onPageChanged"
            use-router
          ></b-pagination-nav>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { RequestData } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import AdvertisementPreview from "./AdvertisementPreview.vue";
import LoginFirst from "@/x-vue/components/user/LoginFirst.vue";
import Service from "@/x-vue/services/component.service";
import ComponentService from "@/x-vue/services/component.service";
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({
  components: { AdvertisementPreview, LoginFirst },
})
export default class AdvertisementList extends Vue {
  posts: Array<AdvertisementModel> = [];
  api = ApiService.instance;
  s = ComponentService.instance;
  as = AdvertisementService.instance;

  loading = false;

  total = 0;
  limit = 10;
  noOfPages = 10;
  currentPage = "1";

  options: RequestData = {};

  get category(): string {
    return this.$route.params.category;
  }
  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    this.options.page = page;
    this.loadPosts();
  }

  async mounted(): Promise<void> {
    this.init();
  }

  async init(): Promise<void> {
    this.loading = true;
    this.options.limit = this.limit;
    this.options.page = 1;
    this.options.categoryId = "advertisement";
    this.options.userIdx = this.$store.state.user.idx;
    this.currentPage = this.$route.query.page as string;

    // when landing on this page, user info in store may take a while to load.
    if (!this.options.userIdx) {
      const si = this.api.getUserSessionId();
      this.options.userIdx = si?.split("-")[0];
    }

    // console.log(this.options);

    try {
      this.total = await this.api.postCount(this.options);
      this.noOfPages = Math.ceil(this.total / this.limit);
      await this.loadPosts();
    } catch (e) {
      Service.instance.error(e);
    }
  }

  async loadPosts(): Promise<void> {
    this.loading = true;
    try {
      this.posts = await AdvertisementService.instance.advertisementSearch(this.options);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      Service.instance.error(e);
    }
  }
}
</script>
