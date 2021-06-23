<template>
  <div class="banner top pointer w-100" :class="position" @click="onClick">
    <img class="w-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { ApiService } from "@/x-vue/services/api.service";
import { Banner } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["position"],
})
export default class AdvertisementTopBanner extends Vue {
  position!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get banners(): Banner[] {
    let category = store.state.currentCategory;

    if (
      !store.state.banners[category] ||
      !store.state.banners[category]["top"]
    ) {
      category = "global";
    }

    /// Check if global banner exists,
    if (!store.state.banners[category]) return [];

    if (!store.state.banners[category]["top"]) return [];

    const banners = store.state.banners[category]["top"].filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });
    return banners;
  }

  get currentBanner(): Banner {
    if (!this.banners.length) {
      return { bannerUrl: this.defaultUrl };
    }
    return this.banners[this.index % this.banners.length];
  }

  get defaultUrl(): string {
    return `/tmp/${this.position}-banner.jpg`;
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }

  onClick(): void {
    ApiService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
