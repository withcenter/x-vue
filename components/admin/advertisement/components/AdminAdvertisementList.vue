<template>
  <div class="admin-advertisement-list w-100">
    <div v-if="advertisements.length">
      <div class="mt-3 w-100">
        <div class="box d-flex p-2 mb-2" v-for="advertisement of advertisements" :key="advertisement.idx">
          <div class="col-10 p-0">
            <router-link :to="`/advertisement/view/${advertisement.idx}`">
              <AdvertisementPreview :advertisement="advertisement"></AdvertisementPreview>
            </router-link>
          </div>
          <div class="ml-1 px-2 py-0 text-center border-left col-2">
            <UserAvatar class="mt-2" :user="advertisement.user"></UserAvatar>
            <div class="mt-2 w-100 text-truncate">
              {{ advertisement.user.displayName }}
            </div>
            <div>{{ "point" | t }}: {{ numberWithCommas(advertisement.user.point) }}</div>
            <router-link
              class="btn btn-link d-block"
              :to="`/chat-message?firebaseUid=${advertisement.user.firebaseUid}`"
              >{{ "chat" | t }}</router-link
            >
            <router-link class="btn btn-link d-block" :to="`/user/${advertisement.user.idx}`">{{
              "profile" | t
            }}</router-link>
          </div>
        </div>
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
    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Loading Advertisements ...
    </div>
    <div class="box text-center mb-2" v-if="!advertisements.length && !loading">
      {{ "no_advertisements" | t }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { ApiService } from "@/x-vue/services/api.service";
import { RequestData } from "@/x-vue/interfaces/interfaces";
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

import ComponentService from "@/x-vue/services/component.service";
import AdvertisementPreview from "@/x-vue/components/advertisement/AdvertisementPreview.vue";
import { numberWithCommas } from "@/x-vue/services/functions";

import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";

@Component({
  components: { AdvertisementPreview, UserAvatar },
})
export default class AdminAdvertisementList extends Vue {
  api = ApiService.instance;
  as = AdvertisementService.instance;

  loading = false;
  advertisements: AdvertisementModel[] = [];

  total = 0;
  limit = 10;
  noOfPages = 10;

  options: RequestData = {};

  async mounted(): Promise<void> {
    this.loading = true;
    this.options.limit = this.limit;
    this.options.categoryId = "advertisement";
    this.options.page = (this.$route.query.page as string) ?? "1";

    try {
      await this.loadAdvertisements();
      this.total = await this.api.postCount(this.options);
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }

  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    this.options.page = page;
    this.loadAdvertisements();
  }

  numberWithCommas(x: number): string {
    return numberWithCommas(x);
  }

  async loadAdvertisements(): Promise<void> {
    this.loading = true;
    try {
      this.advertisements = await AdvertisementService.instance.advertisementSearch(this.options);
      // console.log(this.posts);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      ComponentService.instance.error(e);
    }
  }
}
</script>
