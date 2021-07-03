<template>
  <div class="banner top pointer w-100 h-100" :class="position" @click="onClick">
    <img class="w-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Banner, Banners } from "@/x-vue/interfaces/interfaces";
import Service from "@/x-vue/services/x-vue.service";

@Component({
  props: ["position", "banners"],
})
export default class AdvertisementTopBanner extends Vue {
  position!: string;
  banners!: Banners;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    if (!this.banners) return [];

    if (!this.banners["top"]) return [];

    const banners = this.banners["top"].filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });
    return banners;
  }

  get currentBanner(): Banner {
    if (!this._banners.length) {
      return { bannerUrl: this.defaultUrl };
    }
    return this._banners[this.index % this._banners.length];
  }

  get defaultUrl(): string {
    return `/tmp/${this.position}-banner.jpg`;
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }

  onClick(): void {
    if (this.currentBanner.clickUrl) {
      window.open(this.currentBanner.clickUrl, "_newtab");
    }
    if (this.currentBanner.idx) {
      const path = "/advertisement/view/" + this.currentBanner.idx;
      Service.instance.open(path);
    }
  }
}
</script>
