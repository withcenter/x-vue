<template>
  <div class="d-flex w-100 pb-2 border-bottom" v-if="banners.length">
    <div
      class="banner square pointer mr-1 col-3 p-0"
      @click="onClick(banner)"
      v-for="banner in banners"
      :key="banner.idx"
    >
      <img class="w-100 h-100" :src="banner.bannerUrl" />
    </div>
  </div>
</template>

<script lang="ts">
import { Banner } from "@/x-vue/services/interfaces";
import Component from "vue-class-component";
import Vue from "vue";
import store from "@/store";
import { XHelper } from "@/x-vue-helper/x-helper";

@Component({})
export default class AdvertisementSquareBanners extends Vue {
  get banners(): Banner[] {
    let category = store.state.currentCategory;

    /// if 'currentCategory' is empty, check global banners.
    if (
      !store.state.banners[category] ||
      !store.state.banners[category]["square"]
    )
      category = "global";

    /// if 'global' banner is empty, return empty.
    if (!store.state.banners[category]) return [];

    if (!store.state.banners[category]["square"]) return [];
    else return store.state.banners[category]["square"];
  }

  onClick(banner: Banner): void {
    if (banner.clickUrl) {
      window.open(banner.clickUrl, "_newtab");
    }
    if (banner.idx) {
      const path = "/advertisement/view/" + banner.idx;
      console.log("path", path);
      XHelper.instance.open({ path: path });
    }
  }
}
</script>
