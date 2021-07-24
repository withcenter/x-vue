<template>
  <div class="banner top pointer w-100 h-100" :class="position" @click="onClick">
    <img class="w-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner, BannerCategories } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import { advKey } from "@/service/functions";

@Component({})
export default class extends Vue {
  @Prop({ default: "right" }) position!: string;
  @Prop({ default: () => [] }) banners!: BannerCategories;
  @Prop() categoryId!: string;
  @Prop() countryCode!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    const k = advKey("top", this.categoryId);
    if (!this.banners) return [];
    if (!this.banners[k]) return [];

    return this.banners[k].filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });
  }

  get currentBanner(): Banner {
    if (!this._banners.length) {
      return { bannerUrl: this.defaultUrl };
    }
    return this._banners[this.index % this._banners.length];
  }

  /**
   * @see readme.md of materix.
   */
  get defaultUrl(): string {
    return `/tmp/${this.position}-banner.jpg`;
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }

  onClick(): void {
    AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
