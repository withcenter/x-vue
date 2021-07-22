<template>
  <div class="mt-2 banner square pointer" @click="onClick(currentBanner)" v-if="currentBanner.bannerUrl">
    <img class="w-100 h-100" :src="currentBanner.bannerUrl" />
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
  @Prop() countryCode!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    if (!this.banners) return [];
    if (!this.banners[this.categoryId]) return [];
    if (!this.banners[this.categoryId]["sideBar"]) return [];
    return this.banners[this.categoryId]["sideBar"];
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
