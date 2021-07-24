<template>
  <div class="mt-2 banner square pointer" @click="onClick(currentBanner)" v-if="currentBanner.bannerUrl">
    <img class="w-100 h-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner, BannerCategories } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import { advKey } from "@/service/functions";

@Component({})
export default class AdvertisementSidebarBanner extends Vue {
  @Prop() banners!: BannerCategories;
  @Prop() categoryId!: string;
  @Prop() countryCode!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  // get _banners(): Banner[] {
  //   return this.banners[advKey("line", this.categoryId)];

  //   // const k = advKey("line", this.categoryId);
  //   // if (!this.banners) return [];
  //   // if (!this.banners[k]) return [];
  //   // return this.banners[k];
  // }

  get currentBanner(): Banner {
    const items = this.banners[advKey("sidebar", this.categoryId)];

    if (!items) {
      return {};
    }
    return items[this.index % items.length];
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }

  onClick(): void {
    AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
