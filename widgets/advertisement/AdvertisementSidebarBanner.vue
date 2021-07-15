<template>
  <div class="banner square pointer" @click="onClick(banner)" v-if="currentBanner.bannerUrl">
    <img class="w-100 h-100" :src="banner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner, CategoryBanners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementSidebarBanner extends Vue {
  @Prop() banners!: CategoryBanners;
  @Prop() categoryId!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    if (!this.categoryId) return [];
    if (!this.banners) return [];

    let _banners = this.banners[this.categoryId];
    if (!_banners || !_banners["sidebar"]) _banners = this.banners["global"];
    if (!_banners || !_banners["sidebar"]) return [];

    return _banners["sidebar"];
  }

  get currentBanner(): Banner {
    if (!this._banners.length) {
      return {};
    }
    return this._banners[this.index % this._banners.length];
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }

  onClick(): void {
    AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
