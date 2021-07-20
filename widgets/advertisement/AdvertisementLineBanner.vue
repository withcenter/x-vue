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
import { Banner, CountryBanners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementLineBanner extends Vue {
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
    if (!this.categoryId) return [];
    if (!this.banners) return [];

    const type = "line";
    let _countryBanners = this.banners[this.countryCode];

    // *  - Look for category banners with the same country code.
    if (_countryBanners && _countryBanners[this.categoryId] && _countryBanners[this.categoryId][type]) {
      return _countryBanners[this.categoryId][type];
    }
    // *  - Look for global banners with the same country code.
    if (_countryBanners && _countryBanners["global"] && _countryBanners["global"][type]) {
      return _countryBanners["global"][type];
    }

    _countryBanners = this.banners["AC"];
    // *  - Look for category banners with "all country" code.
    if (_countryBanners && _countryBanners[this.categoryId] && _countryBanners[this.categoryId][type]) {
      return _countryBanners[this.categoryId][type];
    }
    // *  - Finally, display default banner, if any is provided.
    if (_countryBanners && _countryBanners["global"] && _countryBanners["global"][type]) {
      return _countryBanners["global"][type];
    }

    return [];
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
