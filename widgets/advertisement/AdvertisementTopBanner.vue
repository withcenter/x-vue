<template>
  <div class="banner top pointer w-100 h-100" :class="position" @click="onClick">
    <img class="w-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner, CountryBanners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementTopBanner extends Vue {
  @Prop({ default: "right" }) position!: string;
  @Prop() banners!: CountryBanners;
  @Prop() countryCode!: string;
  @Prop() categoryId!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get _banners(): Banner[] {
    if (!this.banners) return [];

    const type = "top";
    let _banners = AdvertisementService.instance.getBanners(this.banners, this.countryCode, this.categoryId, type);

    const banners = _banners.filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });

    // TODO:
    //   If the category have only 1 banner, only top left banner will have category banner displayed.
    //   and all global banners will be displayed on right.
    if (this.categoryId && _banners.length < 2 && this.position == "right") {
      if (
        this.banners[this.countryCode] &&
        this.banners[this.countryCode]["global"] &&
        this.banners[this.countryCode]["global"]["top"] &&
        this.banners[this.countryCode]["global"]["top"].length
      ) {
        return this.banners[this.countryCode]["global"]["top"];
      } else {
        return [];
      }
    }
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
    AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
