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
import { Banner, Banners } from "@/x-vue/services/interfaces";
import Component from "vue-class-component";
import Vue from "vue";

@Component({
  props: ["banners"],
})
export default class AdvertisementSquareBanners extends Vue {
  banners!: Banners;
  get _banners(): Banner[] {
    if (!this.banners || !this.banners["square"]) return [];
    else return this.banners["square"];
  }

  onClick(banner: Banner): void {
    if (banner.clickUrl) {
      window.open(banner.clickUrl, "_newtab");
    }
    if (banner.idx) {
      const path = "/advertisement/view/" + banner.idx;
      console.log("path", path);
      // XHelper.instance.open({ path: path });
      this.$emit("on-click", path);
    }
  }
}
</script>
