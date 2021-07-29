<template>
  <div class="banner line pointer row no-gutters" @click="onClick" v-if="currentBanner">
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
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementLineBanner extends Vue {
  @Prop() banners!: Banner[];
  @Prop({ default: 9000 }) rotationInterval!: number;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get currentBanner(): Banner {
    if (!this.banners.length) {
      return {};
    }
    return this.banners[this.index % this.banners.length];
  }

  rotate(): void {
    setInterval(() => this.index++, this.rotationInterval);
  }

  onClick(): void {
    AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
