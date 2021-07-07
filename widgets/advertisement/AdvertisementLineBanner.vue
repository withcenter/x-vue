<template>
  <div class="mb-4 banner line d-flex pointer border-bottom" @click="onClick" v-if="currentBanner.bannerUrl">
    <img :src="currentBanner.bannerUrl" />
    <div class="title">
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
