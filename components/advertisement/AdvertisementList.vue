<template>
  <section data-cy="advertisement-list-page" class="advertisement-list-page">
    <login-first class="mt-2"></login-first>

    <div v-if="api.loggedIn">
      <div class="mt-3" v-if="posts.length">
        <div class="box p-2 mb-2" v-for="post of posts" :key="post.idx">
          <advertisement-preview :advertisement="post"></advertisement-preview>
        </div>
      </div>
      <div class="mt-3 p-2 text-center" v-if="!posts.length && !loadingPosts">
        No Advertisements ..
      </div>
      <div class="p-3 text-center rounded" v-if="loadingPosts">
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
import { AdvertisementModel, RequestData } from "@/x-vue/services/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import AdvertisementPreview from "./AdvertisementPreview.vue";
import { XHelper } from "@/x-vue-helper/x-helper";
import LoginFirst from "@/x-vue/components/user/LoginFirst.vue";

@Component({
  components: {
    AdvertisementPreview,
    LoginFirst,
  },
})
export default class PostList extends Vue {
  posts: Array<AdvertisementModel> = [];
  api = ApiService.instance;

  loadingPosts = false;

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
    this.options.limit = this.limit;
    this.options.page = 1;
    this.options.categoryId = "advertisement";
    this.options.userIdx = this.api.user.idx;
    this.loadPosts();

    this.currentPage = this.$route.query.page as string;

    try {
      this.total = await this.api.postCount(this.options);
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      XHelper.instance.error(e);
    }
  }

  async loadPosts(): Promise<void> {
    // console.log("adv:loadPosts:: ", this.options);
    this.loadingPosts = true;
    try {
      this.posts = await this.api.advertisementSearch(this.options);
      // console.log(this.posts);
      this.loadingPosts = false;
    } catch (error) {
      XHelper.instance.error(error);
      this.loadingPosts = false;
    }
  }
}
</script>
