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

  /**
   * Banner displaying rules
   *  - Look for category banners with the same country code.
   *  - Look for global banners with the same country code.
   *  - Look for category banners with "all country" code.
   *  - Look for global banners with "all country" code.
   *  - Finally, display default banner, if any is provided.
   */
  get _banners(): Banner[] {
    if (!this.banners) return [];

    const type = "top";
    let _countryBanners = this.banners[this.countryCode];
    let _banners: Banner[] = [];

    // *  - Look for category banners with the same country code.
    if (_countryBanners && _countryBanners[this.categoryId] && _countryBanners[this.categoryId][type]) {
      _banners = _countryBanners[this.categoryId][type];
    }
    // *  - Look for global banners with the same country code.
    else if (_countryBanners && _countryBanners["global"] && _countryBanners["global"][type]) {
      _banners = _countryBanners["global"][type];
    }

    // *  - Look for category banners with "all country" code.
    else if (this.banners["AC"] && this.banners["AC"] && this.banners["AC"][type]) {
      _banners = _countryBanners[this.categoryId][type];
    }
    // *  - Finally, display default banner, if any is provided.
    else if (this.banners["AC"] && this.banners["AC"]["global"] && this.banners["AC"]["global"][type]) {
      _banners = this.banners["AC"]["global"][type];
    } else {
      return [];
    }

    const banners = _banners.filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });

    if (this.categoryId != "global" && !banners.length && this.position == "right") {
      if (!_countryBanners["global"] || _countryBanners["global"]["top"].length < 2) return [];
      return _countryBanners["global"]["top"];
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
