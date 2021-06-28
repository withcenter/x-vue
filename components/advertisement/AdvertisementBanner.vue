<template>
  <div
    class="banner pointer w-100"
    :class="type"
    @click="onClick"
    v-if="currentBanner.bannerUrl"
  >
    <img class="w-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import { Banner } from "@/x-vue/services/interfaces";
import Component from "vue-class-component";
import Vue from "vue";
import store from "@/store";
import { XFunctions } from "@/x-vue-helper/functions";

@Component({
  props: ["type"],
})
export default class AdvertisementBanner extends Vue {
  type!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get banners(): Banner[] {
    let category = store.state.currentCategory;

    /// if 'currentCategory' is empty, or the list for current banner type is empty.
    if (
      !store.state.banners[category] ||
      !store.state.banners[category][this.type]
    )
      category = "global";

    /// if 'global' banner is empty, return empty.
    if (!store.state.banners[category]) return [];

    if (!store.state.banners[category][this.type]) return [];
    else return store.state.banners[category][this.type];
  }

  get currentBanner(): Banner {
    if (!this.banners.length) return {};
    return this.banners[this.index % this.banners.length];
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }
  onClick(): void {
    if (this.currentBanner.clickUrl) {
      window.open(this.currentBanner.clickUrl, "_newtab");
    }
    if (this.currentBanner.idx) {
      const path = "/advertisement/view/" + this.currentBanner.idx;
      console.log("path", path);
      XFunctions.instance.open({ path: path });
    }
  }
}
</script>
