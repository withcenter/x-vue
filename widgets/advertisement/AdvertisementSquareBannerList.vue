<template>
  <div class="row no-gutters" v-if="bannerList.length">
    <AdvertisementSquareBanner :banner="bannerList[0]" class="col-3 pr-1"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="bannerList[1]" class="col-3 px-1"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="bannerList[2]" class="col-3 px-1"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="bannerList[3]" class="col-3 pl-1"></AdvertisementSquareBanner>
    <!-- <AdvertisementSquareBanner :banner="bannerList[4]" class="col-2 px-1"></AdvertisementSquareBanner> -->
    <!-- <AdvertisementSquareBanner :banner="bannerList[5]" class="col-2 pl-1"></AdvertisementSquareBanner> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Banner, CountryBanners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import AdvertisementSquareBanner from "@/x-vue/widgets/advertisement/AdvertisementSquareBanner.vue";

@Component({
  components: { AdvertisementSquareBanner },
})
export default class AdvertisementSquareBannerList extends Vue {
  @Prop() banners!: CountryBanners;
  @Prop() countryCode!: string;
  @Prop() categoryId!: string;

  get bannerList(): Banner[] {
    if (!this.categoryId) return [];
    if (!this.banners) return [];

    const type = "square";
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

  onClick(banner: Banner): void {
    AdvertisementService.instance.openAdvertisement(banner);
  }
}
</script>
