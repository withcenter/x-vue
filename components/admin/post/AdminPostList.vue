<template>
  <section>
    <h4>Post list</h4>
    <form @submit.prevent="search" class="mb-2">
      <div class="d-flex">
        <b-form-group label-size="sm" label="userIdx" label-for="userIdx" class="mb-0">
          <b-form-input size="sm" id="userIdx" v-model="forum.userIdx" placeholder="userIdx"></b-form-input>
        </b-form-group>
        <b-form-group label-size="sm" label="categoryId" label-for="categoryId" class="mb-0">
          <b-form-input size="sm" id="categoryId" v-model="forum.categoryId" placeholder="categoryId"></b-form-input>
        </b-form-group>
        <b-form-group label-size="sm" label="limit" label-for="limit" class="mb-0">
          <b-form-input size="sm" id="limit" v-model="forum.limit" placeholder="limit"></b-form-input>
        </b-form-group>
      </div>

      <button class="btn btn-primary mt-2">Search</button>
    </form>

    <div class="mb-2">
      <b-checkbox
        :disabled="visibleFields.length == 1 && field.visible"
        v-for="field in fields"
        :key="field.key"
        v-model="field.visible"
        inline
      >
        {{ field.label || field.key | t }}
      </b-checkbox>
    </div>
    <div class="overflow-auto">
      <b-table
        small
        striped
        hover
        :items="forum.posts"
        :fields="visibleFields"
        :busy="forum.loading"
        :bordered="true"
        responsive="true"
      >
        <template #row-details="row">
          <b-card>
            <div class="mt-2 d-flex">
              <UserAvatar :parent="row.item"></UserAvatar>
              <div class="ml-2">
                <UserDisplayName class="font-weight-bold" :parent="row.item"></UserDisplayName>
                <PostMeta data-cy="post-view-meta" :post="row.item"></PostMeta>
              </div>
            </div>
            <Content class="mt-2" :parent="row.item"> </Content>
            <FileList class="mt-2" :post="row.item"></FileList>
          </b-card>
        </template>

        <template #cell(user)="row">
          <div class="d-flex">
            <UserAvatar :parent="row.item"></UserAvatar>
            <router-link :to="'/admin/user/edit/' + row.item.user.idx">
              <div>{{ row.item.user.name }}</div>
              <div>idx: {{ row.item.user.idx }}</div>
            </router-link>
          </div>
        </template>

        <template #cell(idx)="row">
          <router-link :to="row.item.relativeUrl">{{ row.item.idx }}</router-link>
        </template>

        <template #cell(title)="row">
          {{ row.item.title.substring(0, 32) }}
          <span class="align-middle">{{ row.item.fileIdxes ? "(&#128247;)" : "" }}</span>
        </template>

        <template #cell(content)="row">
          {{ row.item.content.substring(0, 64) }}
        </template>

        <template #cell(categoryId)="row">
          <router-link :to="'/forum/' + row.item.categoryId">{{ row.item.categoryId }}</router-link>
        </template>

        <template #cell(shortDate)="row">
          <div class="text-nowrap">{{ row.item.shortDate }}</div>
        </template>

        <template #table-busy>
          <Loading></Loading>
        </template>

        <template #cell(action)="row">
          <button class="btn btn-sm btn-secondary" @click="row.toggleDetails">preview</button>
        </template>

        <!-- <template #table-caption>This is a table caption.</template> -->
      </b-table>
      <div v-if="this.forum.posts.length" class="d-flex mt-3 justify-content-center w-100">
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
import { ForumInterface } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";

import UserDisplayName from "@/x-vue/components/forum/UserDisplayName.vue";
import UserAvatar from "@/x-vue/components/forum/UserAvatar.vue";
import FileList from "@/x-vue/components/file/FileList.vue";
import Content from "@/x-vue/components/forum/Content.vue";

import PostMeta from "@/x-vue/components/forum/post/PostMeta.vue";
import { Err } from "@/x-vue/services/defines";

import Loading from "@/x-vue/widgets/common/Loading.vue";
@Component({
  components: {
    UserDisplayName,
    UserAvatar,
    FileList,
    Content,
    PostMeta,
    Loading,
  },
})
export default class AdminPostList extends Vue {
  forum: ForumInterface = new ForumInterface();

  total = 0;
  noOfPages = 10;
  currentPage = "1";

  categoryId = "";
  subCategory = "";

  fields: Array<{ [index: string]: unknown }> = [
    {
      key: "user",
      visible: true,
    },
    {
      key: "idx",
      visible: true,
    },
    {
      key: "title",
      visible: true,
    },
    {
      key: "content",
      visible: true,
    },
    {
      key: "categoryId",
      label: "Category",
      sortable: true,
      visible: true,
    },
    {
      key: "shortDate",
      label: "Date",
      visible: true,
    },
    {
      key: "action",
      visible: true,
    },
  ];
  get visibleFields(): Array<{ [index: string]: unknown }> {
    return this.fields.filter((field) => field.visible);
  }

  mounted(): void {
    this.forum.limit = 5;
    this.initPostCount();
    this.loadPosts();
  }
  async initPostCount(): Promise<void> {
    try {
      this.total = await ApiService.instance.postCount(this.forum.searchOptions);
      this.noOfPages = Math.ceil(this.total / this.forum.limit);
    } catch (e) {
      if (e == Err.category_not_exists) {
        console.log("@ignore category not exists error on counting no of posts.");
      } else {
        ComponentService.instance.error(e);
      }
    }
  }

  linkGen(pageNum: number): string {
    const parts: string[] = [];
    if (pageNum > 1) parts.push(`page=${pageNum}`);
    if (this.categoryId) {
      parts.push("c=" + this.categoryId);
    }
    if (this.subCategory) {
      parts.push("sc=" + this.subCategory);
    }
    if (parts.length) {
      return "?" + parts.join("&");
    }
    return "/admin/post";
  }

  onPageChanged(page: number): void {
    this.forum.page = page;
    this.loadPosts();
  }

  async search(): Promise<void> {
    this.forum.page = 1;
    this.currentPage = "1";
    this.initPostCount();
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    // console.log(this.forum.searchOptions);
    if (this.forum.canLoad) return;
    this.forum.loading = true;

    console.log(this.forum.searchOptions);
    try {
      this.forum.posts = await ApiService.instance.postSearch(this.forum.searchOptions);
      console.log(this.forum.posts);
    } catch (error) {
      ComponentService.instance.error(error);
    }
    this.forum.endLoad();
  }
}
</script>
