<template>
  <div class="mt-2 banner square pointer" @click="onClick(currentBanner)" v-if="currentBanner">
    <img class="w-100 h-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementSidebarBanner extends Vue {
  @Prop({ default: () => [] }) banners!: Banner[];
  @Prop({ default: 9000 }) rotationInterval!: number;

  index = 0;
  timer = 0;

  mounted(): void {
    this.rotate();
  }

  destroyed(): void {
    clearInterval(this.timer);
  }

  get currentBanner(): Banner {
    return this.banners[this.index % this.banners.length];
  }

  rotate(): void {
    if (this.timer) clearInterval(this.timer);
    let interval = 9000;
    if (this.rotationInterval) interval = this.rotationInterval;
    this.timer = setInterval(() => this.index++, interval);
  }

  onClick(): void {
    if (this.currentBanner) {
      AdvertisementService.instance.openAdvertisement(this.currentBanner);
    }
  }
}
</script>
