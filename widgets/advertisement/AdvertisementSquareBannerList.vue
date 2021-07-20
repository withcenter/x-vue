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
    return AdvertisementService.instance.getBanners(this.banners, this.countryCode, this.categoryId, type);
  }

  onClick(banner: Banner): void {
    AdvertisementService.instance.openAdvertisement(banner);
  }
}
</script>
