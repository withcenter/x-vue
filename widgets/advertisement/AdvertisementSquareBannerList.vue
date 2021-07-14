<template>
  <div class="d-flex w-100 pb-2 border-bottom row no-gutters" v-if="bannerList.length">
    <AdvertisementSquareBanner :banner="bannerList[0]" class="col-3"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="bannerList[2]" class="col-3"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="bannerList[3]" class="col-3"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="bannerList[4]" class="col-3"></AdvertisementSquareBanner>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Banner, Banners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import AdvertisementSquareBanner from "@/x-vue/widgets/advertisement/AdvertisementSquareBanner.vue";

@Component({
  components: {
    AdvertisementSquareBanner,
  },
})
export default class AdvertisementSquareBannerList extends Vue {
  @Prop() banners!: Banners;
  get bannerList(): Banner[] {
    if (!this.banners || !this.banners["square"]) return [];
    else return this.banners["square"];
  }

  onClick(banner: Banner): void {
    AdvertisementService.instance.openAdvertisement(banner);
  }
}
</script>
