<template>
  <div class="banner top pointer w-100 h-100" :class="position" @click="onClick" v-if="currentBanner">
    <b-img-lazy class="w-100" :src="currentBanner.bannerUrl"></b-img-lazy>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class extends Vue {
  @Prop({ default: "right" }) position!: string;
  @Prop({ default: () => [] }) banners!: Banner[];
  @Prop() rotationInterval!: number;

  index = 0;
  timer = 0;

  bannerList: Banner[] = [];

  mounted(): void {
    this.initBannersAndInterval(this.banners);
  }

  /**
   * Watch changes on banner list data.
   *
   * This component may not re-mount if this is always shown in the DOM.
   * to update for correct data banners it will watch for changes.
   */
  @Watch("banners")
  watchBanners(_n: []): void {
    if (_n.length) {
      this.initBannersAndInterval(_n);
    }
  }

  /**
   * @see readme.md of materix.
   */
  get defaultUrl(): string {
    return `/tmp/${this.position}-banner.jpg`;
  }

  beforeDestroy(): void {
    clearInterval(this.timer);
  }

  get currentBanner(): Banner {
    if (!this.bannerList.length) {
      return { bannerUrl: this.defaultUrl };
    }
    return this.bannerList[this.index % this.bannerList.length];
  }

  initBannersAndInterval(banners: Banner[]): void {
    this.bannerList = banners.filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });

    if (this.bannerList.length > 1) {
      this.rotate();
    } else {
      clearInterval(this.timer); // rotation is not needed if it only needs to display 1 banner.
    }
  }

  rotate(): void {
    if (this.timer) clearInterval(this.timer);
    let interval = 9000;
    if (this.rotationInterval) interval = this.rotationInterval;
    this.timer = setInterval(() => this.index++, interval);
  }

  onClick(): void {
    if (this.currentBanner) AdvertisementService.instance.openAdvertisement(this.currentBanner);
  }
}
</script>
