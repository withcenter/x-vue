<template>
  <section data-cy="advertisement-list-page" class="advertisement-list-page">
    <div class="mt-3" v-if="posts.length">
      <div v-for="post of posts" :key="post.idx">
        <router-link :to="`/advertisement/edit/${post.idx}`">
          No. {{ post.idx }} - {{ post.name }}
        </router-link>
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
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { PostModel, RequestData } from "@/x-vue/services/interfaces";
import { AppService } from "@/service/app.service";
import PostTitleMeta from "@/x-vue/components/forum/PostTitleMeta.vue";

@Component({
  components: {
    PostTitleMeta,
  },
})
export default class PostList extends Vue {
  posts: Array<PostModel> = [];
  app = AppService.instance;

  loadingPosts = false;

  total = 0;
  limit = 5;
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
    console.log("page changed", page);
    this.options.page = page;
    this.loadPosts();
  }

  async mounted(): Promise<void> {
    this.options.limit = this.limit;
    this.options.page = 1;
    this.options.comments = 1;
    this.loadPosts();

    this.currentPage = this.$route.query.page as string;

    try {
      this.total = await this.app.api.postCount(this.options);
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      this.app.error(e);
    }
  }

  async loadPosts(): Promise<void> {
    console.log(this.options);
    this.loadingPosts = true;
    try {
      this.posts = await this.app.api.postSearch(this.options);
      console.log(this.posts);
      this.loadingPosts = false;
    } catch (error) {
      this.app.error(error);
      this.loadingPosts = false;
    }
  }
}
</script>
