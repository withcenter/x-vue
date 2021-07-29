<template>
  <div class="banner top pointer w-100 h-100" :class="position" @click="onClick" v-if="currentBanner">
    <b-img-lazy class="w-100" :src="currentBanner.bannerUrl"></b-img-lazy>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class extends Vue {
  @Prop({ default: "right" }) position!: string;
  @Prop({ default: () => [] }) banners!: Banner[];
  @Prop({ default: 0 }) rotationInterval!: number;

  index = 0;

  _banners: Banner[] = [];

  timer = 0;

  beforeMount(): void {
    console.log("this.banners; ", this.banners);
    this._banners = this.banners.filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });

    this.rotate();
  }

  destroyed(): void {
    clearInterval(this.timer);
  }

  get currentBanner(): Banner | undefined {
    console.log("index;", this.index);
    if (!this._banners || !this._banners.length) return undefined;
    if (!this._banners.length) {
      return { bannerUrl: this.defaultUrl };
    }
    return this._banners[this.index % this._banners.length];
  }

  /**
   * @see readme.md of materix.
   */
  get defaultUrl(): string {
    return `/tmp/${this.position}-banner.jpg`;
  }

  rotate(): void {
    if (this.timer) clearInterval(this.timer);
    let interval = 9000;
    if (this.rotationInterval) interval = this.rotationInterval;
    console.log("this.rotationInterval", interval);
    this.timer = setInterval(() => this.index++, interval);
  }

  onClick(): void {
    if (this.currentBanner) AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
