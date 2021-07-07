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
import Component from "vue-class-component";
import Vue from "vue";
import { Banner, Banners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

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
    AdvertisementService.instance.openAdvertisement(banner);
  }
}
</script>
