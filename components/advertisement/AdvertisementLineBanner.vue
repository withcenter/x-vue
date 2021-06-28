<template>
  <div
    class="mb-4 banner line d-flex pointer border-bottom"
    @click="onClick"
    v-if="currentBanner.bannerUrl"
  >
    <img :src="currentBanner.bannerUrl" />
    <div class="title">
      {{ currentBanner.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { Banner } from "@/x-vue/services/interfaces";
import Component from "vue-class-component";
import Vue from "vue";
import store from "@/store";
import { XFunctions } from "@/x-vue-helper/functions";

@Component({})
export default class AdvertisementLineBanner extends Vue {
  index = 0;

  mounted(): void {
    this.rotate();
  }

  get banners(): Banner[] {
    let category = store.state.currentCategory;

    if (
      !store.state.banners[category] ||
      !store.state.banners[category]["line"]
    )
      category = "global";

    if (!store.state.banners[category]) return [];

    if (!store.state.banners[category]["line"]) return [];
    else return store.state.banners[category]["line"];
  }

  get currentBanner(): Banner {
    if (!this.banners.length) {
      return {};
    }
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
