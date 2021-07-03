<template>
  <div class="banner pointer w-100" :class="type" @click="onClick" v-if="currentBanner.bannerUrl">
    <img class="w-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import { Banner, Banners } from "@/x-vue/interfaces/interfaces";
import Component from "vue-class-component";
import Vue from "vue";
import Service from "@/x-vue/services/x-vue.service";

@Component({
  props: ["type", "banners"],
})
export default class AdvertisementBanner extends Vue {
  type!: string;
  banners!: Banners;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    if (!this.banners || !this.banners[this.type]) return [];
    else return this.banners[this.type];
  }

  get currentBanner(): Banner {
    if (!this._banners.length) return {};
    return this._banners[this.index % this._banners.length];
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
