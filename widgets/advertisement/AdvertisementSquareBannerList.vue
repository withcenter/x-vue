<template>
  <div class="row no-gutters" v-if="bannerList.length">
    <AdvertisementSquareBanner :banner="banners[0]" class="col-3 pr-1"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="banners[1]" class="col-3 px-1"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="banners[2]" class="col-3 px-1"></AdvertisementSquareBanner>
    <AdvertisementSquareBanner :banner="banners[3]" class="col-3 pl-1"></AdvertisementSquareBanner>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import AdvertisementSquareBanner from "@/x-vue/widgets/advertisement/AdvertisementSquareBanner.vue";

@Component({
  components: { AdvertisementSquareBanner },
})
export default class AdvertisementSquareBannerList extends Vue {
  @Prop() banners!: Banner[];
  onClick(banner: Banner): void {
    AdvertisementService.instance.openAdvertisement(banner);
  }
}
</script>
