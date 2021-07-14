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
import Component from "vue-class-component";
import Vue from "vue";
import { Banner, Banners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({
  props: ["banners"],
})
export default class AdvertisementLineBanner extends Vue {
  banners!: Banners;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    if (!this.banners || !this.banners["line"]) return [];
    else return this.banners["line"];
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
