<template>
  <section>
    <h4>File list</h4>

    <b-form-select v-model="viewMode" class="mb-3 w-25">
      <b-form-select-option value="table">Table</b-form-select-option>
      <b-form-select-option value="gallery">Gallery</b-form-select-option>
    </b-form-select>

    <div class="mb-3">
      <div class="my-2 fw-700">Total {{ total }} No of page {{ noOfPages }}</div>
      <form @submit.prevent="loadFiles">
        <b-row class="mb-2" no-gutters>
          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="limit">
              <b-form-input id="limit" v-model="req.limit" placeholder="limit"></b-form-input> </b-input-group
          ></b-col>
          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="idx">
              <b-form-input id="idx" v-model="req.idx" :placeholder="'idx' | t"></b-form-input> </b-input-group
          ></b-col>
          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="taxonomy">
              <b-form-input
                id="taxonomy"
                v-model="req.taxonomy"
                :placeholder="'taxonomy' | t"
              ></b-form-input> </b-input-group
          ></b-col>
          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="entity">
              <b-form-input id="entity" v-model="req.entity" :placeholder="'entity' | t"></b-form-input> </b-input-group
          ></b-col>
          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="userIdx">
              <b-form-input
                id="userIdx"
                v-model="req.userIdx"
                :placeholder="'userIdx' | t"
              ></b-form-input> </b-input-group
          ></b-col>
          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="code">
              <b-form-input id="code" v-model="req.code" :placeholder="'code' | t"></b-form-input> </b-input-group
          ></b-col>

          <b-col cols="3" class="mb-2">
            <b-input-group class="pr-2" size="sm" prepend="name">
              <b-form-input id="name" v-model="req.name" :placeholder="'name' | t"></b-form-input> </b-input-group
          ></b-col>
        </b-row>
        <b-button type="submit" class="px-5" size="sm" variant="primary">{{ "search" | t }}</b-button>
      </form>
    </div>

    <div class="mb-3" v-if="viewMode == 'gallery'">
      <b-row align-content="stretch" no-gutters v-if="!loading">
        <b-col cols="3" class="mb-2 pr-2" v-for="file in files" :key="file.idx">
          <b-card
            class="h-100"
            :img-src="file.thumbnailUrl"
            @click.stop="showImage(file)"
            img-alt="Image"
            body-class="p-1"
          >
            <b-card-text>
              <div @click.stop="">
                <UserAvatarWithInfo class="text-left" :user="file.user"></UserAvatarWithInfo>
              </div>
              <div><b>idx:</b> {{ file.idx }}</div>
              <div @click.stop="">
                <div class="d-flex justify-content-start" v-if="file.taxonomy == 'posts'">
                  <b>{{ "posts" | t }}</b>
                  <span class="flex-grow-1"></span>
                  <router-link class="px-2" :to="'/' + file.post.idx">
                    <BoxArrowUpRightSvg class="action-icon"></BoxArrowUpRightSvg>
                  </router-link>
                  <router-link class="px-2" :to="'/forum/edit/' + file.post.idx"
                    ><PencilSvg class="action-icon"></PencilSvg
                  ></router-link>
                  <div class="px-2" @click="onClickDelete(file.post)">
                    <TrashSvg class="action-icon pointer"></TrashSvg>
                  </div>
                </div>
                <div v-else-if="file.taxonomy == 'users' || file.code == 'photoUrl'">
                  <b>{{ "users" | t }}</b> <template v-if="file.code">({{ file.code }})</template>
                  <router-link class="px-2" :to="'/admin/user/edit/' + file.user.idx"
                    ><PencilSvg class="action-icon"></PencilSvg
                  ></router-link>
                </div>
              </div>
              <div v-if="file.taxonomy == 'posts'">
                <div>{{ file.post.title }}</div>
                <div>{{ file.post.content }}</div>
              </div>

              <div></div>
            </b-card-text>
            <div class="position-absolute right top">
              <b-button variant="light" size="sm" @click.stop="fileDelete(file)" pill>
                <TrashSvg style="width: 22px" class="trash-icon"></TrashSvg>
              </b-button>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <Loading v-if="loading"></Loading>
    </div>

    <div v-if="viewMode == 'table'">
      <div class="p-1 mb-3 border-radius-sm" style="border: 1px solid #e8e8e8">
        <b-checkbox
          size="sm"
          :disabled="visibleFields.length == 1 && field.visible"
          v-for="field in fields"
          :key="field.key"
          v-model="field.visible"
          inline
        >
          {{ field.label || field.key | t }}
        </b-checkbox>
      </div>
      <section class="overflow-auto mb-3">
        <b-table
          table-class="text-center text-nowrap"
          small
          striped
          hover
          :items="files"
          :fields="visibleFields"
          :busy="loading"
          :bordered="true"
          responsive="true"
        >
          <template #head()="scope">
            <div>{{ scope.label | t }}</div>
          </template>

          <template #cell(file)="row">
            <div
              @click="$bvModal.show('file-modal-' + row.item.idx)"
              class="mr-3 pointer"
              :style="'height:50px;width:50px'"
            >
              <b-img width="50" style="height: 50px" thumbnail fluid rounded="0" :src="row.item.thumbnailUrl"></b-img>
            </div>

            <b-modal :id="'file-modal-' + row.item.idx" hide-footer>
              <template #modal-title>{{ row.item.url }}</template>
              <div>
                <b-img :src="row.item.url" fluid :alt="row.item.name"></b-img>
              </div>
              <b-button class="mt-3" block @click="$bvModal.hide('file-modal-' + row.item.idx)">Close</b-button>
            </b-modal>
          </template>

          <template #cell(taxonomy)="row">
            <div class="d-flex">
              <div v-if="row.item.taxonomy == 'posts'">{{ "posts" | t }}</div>
              <div v-if="row.item.taxonomy == 'users' || row.item.code == 'photoUrl'">{{ "users" | t }}</div>
              <router-link class="px-2" :to="'/' + row.item.post.idx">
                <BoxArrowUpRightSvg class="action-icon"></BoxArrowUpRightSvg>
              </router-link>
              <router-link class="px-2" :to="'/forum/edit/' + row.item.post.idx"
                ><PencilSvg class="action-icon"></PencilSvg
              ></router-link>
              <div class="px-2" @click="onClickDelete(row.item.post)">
                <TrashSvg class="action-icon pointer"></TrashSvg>
              </div>
            </div>
          </template>

          <template #cell(userIdx)="row">
            <UserAvatarWithInfo class="text-left" :user="row.item.user"></UserAvatarWithInfo>
          </template>

          <template #cell(action)="row">
            <div class="d-flex align-item-center">
              <button class="btn" @click="fileDelete(row.item)">
                <TrashSvg class="action-icon"></TrashSvg>
              </button>
            </div>
          </template>

          <template #table-busy>
            <Loading></Loading>
          </template>
        </b-table>
      </section>
    </div>

    <div class="overflow-auto" v-if="noOfPages > 0">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="noOfPages"
        v-model="req.page"
        v-on:change="onPageChanged"
        use-router
      ></b-pagination-nav>
    </div>
  </section>
</template>

<style scoped>
.action-icon {
  width: 1em;
}
</style>

<script lang="ts">
import { FileModel, RequestData } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";

import TrashSvg from "@/x-vue/svg/TrashSvg.vue";
import PencilSvg from "@/x-vue/svg/PencilSvg.vue";
import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";

import UserAvatarWithInfo from "@/x-vue/widgets/common/UserAvatarWithInfo.vue";
import Loading from "@/x-vue/widgets/common/Loading.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
@Component({
  components: {
    TrashSvg,
    Loading,
    PencilSvg,
    UserAvatarWithInfo,
    BoxArrowUpRightSvg,
  },
})
export default class AdminFileList extends Vue {
  files: Array<FileModel> = [];

  loading = false;

  req: RequestData = {
    limit: 12,
    page: "1",
  };
  total = 0;
  noOfPages = 0;

  viewMode: "table" | "gallery" = "gallery";

  fields: Array<{ [index: string]: unknown }> = [
    { key: "file", visible: true },
    { key: "idx", label: "File idx", visible: true, sortable: true },
    { key: "taxonomy", visible: true },
    { key: "entity", visible: true, sortable: true },
    { key: "userIdx", label: "User", visible: true, sortable: true },
    { key: "code", visible: true },
    { key: "path", visible: false },
    { key: "name", visible: false },
    { key: "type", visible: false },
    { key: "size", visible: false, sortable: true },
    { key: "thumbnailUrl", visible: false },
    { key: "url", visible: false },
    { key: "shortDate", label: "Date", visible: true },
    { key: "createdAt", visible: false },
    { key: "updatedAt", visible: false },
    { key: "action", visible: true },
  ];

  get visibleFields(): Array<{ [index: string]: unknown }> {
    return this.fields.filter((field) => field.visible);
  }
  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    this.req.page = "" + page;
    this.loadFiles();
  }

  mounted(): void {
    this.loadFiles();
  }

  async loadFiles(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    try {
      this.files = await ApiService.instance.fileSearch(this.req);

      console.log("files::", this.files);

      this.total = await ApiService.instance.fileCount(this.req);
      this.noOfPages = Math.ceil(this.total / this.req.limit);
    } catch (e) {
      ComponentService.instance.error(e);
    }
    this.loading = false;
  }

  async fileDelete(file: FileModel): Promise<void> {
    console.log(file);

    const conf = await ComponentService.instance.confirm("File Delete", "Are you sure you want to delete this file?");
    if (!conf) return;

    try {
      await ApiService.instance.fileDelete(file.idx);
      this.loadFiles();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }

  showImage(file: FileModel): void {
    const h = this.$createElement;
    // Using HTML string
    const titleVNode = h("div", { domProps: { innerHTML: file.name } });
    // More complex structure
    const messageVNode = h("b-img", {
      props: {
        src: file.url,
        thumbnail: true,
        center: true,
        fluid: true,
        // rounded: "circle",
      },
    });
    // We must pass the generated VNodes as arrays
    this.$bvModal.msgBoxOk([messageVNode], {
      title: [titleVNode],
      buttonSize: "sm",
      centered: true,
      size: "lg",
    });
  }

  async onClickDelete(post: PostModel): Promise<void> {
    const re = await ComponentService.instance.confirm("Delete Post", "Do you want to delete the post?");
    if (!re) return;
    try {
      const cat = await ApiService.instance.postDelete(post.idx);
      this.loadFiles();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
