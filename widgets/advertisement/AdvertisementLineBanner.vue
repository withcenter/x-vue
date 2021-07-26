<template>
  <div class="banner line pointer row no-gutters" @click="onClick" v-if="currentBanner.bannerUrl">
    <div class="col-2 p-0 image-holder">
      <img :src="currentBanner.bannerUrl" />
    </div>
    <div class="col-10 title">
      {{ currentBanner.title }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner, AllCategoryBanners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import { advKey } from "@/service/functions";

@Component({})
export default class AdvertisementLineBanner extends Vue {
  @Prop() banners!: AllCategoryBanners;
  @Prop() countryCode!: string;
  @Prop() categoryId!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    const k = advKey("line", this.categoryId);
    if (!this.banners) return [];
    if (!this.banners[k]) return [];
    return this.banners[k];
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
