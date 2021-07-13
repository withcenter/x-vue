<template>
  <section>
    <h4>Post list</h4>
    <form @submit.prevent="search" class="mb-2">
      <div class="d-flex flex-wrap flex-md-nowrap">
        <b-input-group class="pr-2" size="sm" prepend="userIdx">
          <b-form-input id="userIdx" v-model="forum.userIdx" placeholder="userIdx"></b-form-input>
        </b-input-group>

        <b-input-group class="pr-2 mt-2 mt-md-0" size="sm" prepend="categoryId">
          <b-form-input id="categoryId" v-model="forum.categoryId" placeholder="categoryId"></b-form-input>
        </b-input-group>

        <b-input-group class="pr-2 mt-2 mt-md-0" size="sm" prepend="limit">
          <b-form-input id="limit" v-model="forum.limit" placeholder="limit"></b-form-input>
        </b-input-group>
      </div>

      <button class="btn btn-primary mt-2 px-4 btn-sm">Search</button>
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
        table-class="text-center"
        small
        striped
        hover
        :items="forum.posts"
        :fields="visibleFields"
        :busy="forum.loading"
        :bordered="true"
        responsive="true"
        head-variant="dark"
      >
        <template #head()="scope">
          <div class="text-nowrap">{{ scope.label | t }}</div>
        </template>

        <template #cell(user)="row">
          <UserAvatarWithInfo class="text-left" :user="row.item.user"></UserAvatarWithInfo>
        </template>

        <template #cell(idx)="row">
          <router-link :to="'/' + row.item.idx"
            >{{ row.item.idx }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg
          ></router-link>
        </template>

        <template #cell(title)="row">
          <div class="d-flex justify-content-between">
            <div v-if="row.item.deletedAt">{{ "deleted" | t }}</div>
            <div v-else>
              {{ row.item.title.substring(0, 32) }}
              <span v-if="row.item.fileIdxes">(<CameraSvg class="action-icon"></CameraSvg>)</span>
            </div>

            <router-link class="px-2" :to="'/' + row.item.idx"><BoxArrowUpRightSvg></BoxArrowUpRightSvg></router-link>
          </div>
        </template>

        <template #cell(content)="row">
          <div class="d-flex justify-content-between">
            <div v-if="row.item.deletedAt">{{ "deleted" | t }}</div>
            <div v-else>
              {{ row.item.content.substring(0, 64) }}
            </div>

            <router-link class="px-2" :to="'/' + row.item.idx"><BoxArrowUpRightSvg></BoxArrowUpRightSvg></router-link>
          </div>
        </template>

        <template #cell(categoryId)="row">
          <router-link :to="'/forum/' + row.item.categoryId"
            >{{ row.item.categoryId }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg
          ></router-link>
        </template>

        <template #cell(shortDate)="row">
          <div class="text-nowrap">{{ row.item.shortDate }}</div>
        </template>

        <template #table-busy>
          <Loading></Loading>
        </template>

        <template #cell(action)="row">
          <div class="d-flex justify-content-around">
            <div class="pointer px-2" @click="row.toggleDetails">
              <BoxArrowInUpSvg class="action-icon" v-if="row.detailsShowing"></BoxArrowInUpSvg>
              <BoxArrowInDownSvg v-else></BoxArrowInDownSvg>
            </div>
            <router-link class="px-2" :to="'/forum/edit/' + row.item.idx"
              ><PencilSvg class="action-icon"></PencilSvg
            ></router-link>
            <div class="px-2" @click="onClickDelete(row.item)">
              <TrashSvg class="action-icon pointer"></TrashSvg>
            </div>
          </div>
        </template>

        <template #row-details="row">
          <b-card class="text-left">
            <div class="d-flex justify-content-between">
              <h3 id="post-title">{{ row.item.title }}</h3>
            </div>
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

<style scoped>
.action-icon {
  width: 1em;
}
</style>

<script lang="ts">
import { ForumInterface, PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";

import UserDisplayName from "@/x-vue/components/forum/UserDisplayName.vue";
import UserAvatar from "@/x-vue/components/forum/ForumUserAvatar.vue";
import FileList from "@/x-vue/components/file/FileList.vue";
import Content from "@/x-vue/components/forum/Content.vue";

import PostMeta from "@/x-vue/components/forum/post/PostMeta.vue";
import { Err } from "@/x-vue/services/defines";

import UserAvatarWithInfo from "@/x-vue/components/admin/user/AdminUserAvatarWithInfo.vue";

import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";
import BoxArrowInUpSvg from "@/x-vue/svg/BoxArrowInUpSvg.vue";
import BoxArrowInDownSvg from "@/x-vue/svg/BoxArrowInDownSvg.vue";
import Loading from "@/x-vue/widgets/common/Loading.vue";

import PencilSvg from "@/x-vue/svg/PencilSvg.vue";

import CameraSvg from "@/x-vue/svg/CameraSvg.vue";
import TrashSvg from "@/x-vue/svg/TrashSvg.vue";
@Component({
  components: {
    UserDisplayName,
    UserAvatar,
    FileList,
    Content,
    PostMeta,
    Loading,
    UserAvatarWithInfo,
    BoxArrowInUpSvg,
    BoxArrowInDownSvg,
    BoxArrowUpRightSvg,
    TrashSvg,
    PencilSvg,
    CameraSvg,
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
      label: "post idx",
      visible: true,
    },
    {
      key: "title",
      visible: true,

      tdClass: "text-left",
    },
    {
      key: "content",
      visible: true,

      tdClass: "text-left",
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

  async onClickDelete(post: PostModel): Promise<void> {
    const re = await ComponentService.instance.confirm("Delete Post", "Do you want to delete the post?");
    if (!re) return;
    try {
      const cat = await ApiService.instance.postDelete(post.idx);
      this.loadPosts();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
