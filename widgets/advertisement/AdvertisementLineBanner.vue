<template>
  <div class="banner line pointer row no-gutters" @click="onClick" v-if="banner">
    <div class="col-2 p-0 image-holder">
      <img :src="banner.bannerUrl" />
    </div>
    <div class="col-10 title">
      {{ banner.title }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementLineBanner extends Vue {
  @Prop({ default: () => [] }) banner!: Banner;

  onClick(): void {
    AdvertisementService.instance.openAdvertisement(this.banner);
  }
}
</script>
