<template>
  <div
    class="banner top pointer"
    :class="position"
    @click="onClick"
    v-if="banners.length"
  >
    <img class="w-100" :src="src" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { ApiService } from "@/x-vue/services/api.service";
import { Banner } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["position"],
})
export default class AdvertisementTopBanner extends Vue {
  position!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get banners(): Banner[] {
    let category = store.state.currentCategory;
    console.log(
      "store.state.banners[store.state.currentCategory]",
      category,
      store.state.banners
    );

    if (typeof store.state.banners[category] === "undefined") {
      category = "global";
    }

    /// Check if global banner exists,
    if (!store.state.banners[category]) return [];

    if (!store.state.banners[category]["top"]) return [];

    const banners = store.state.banners[category]["top"].filter((v, i) => {
      if (this.position == "left") return i % 2 == 0;
      else return i % 2 != 0;
    });
    return banners;
  }

  get src(): string {
    return this.banners[this.index % this.banners.length].bannerUrl;
  }

  rotate() {
    setInterval(() => this.index++, 7000);
  }

  // get src(): string {
  //   if (!this.banners.length || !this.banners[this.index]) {
  //     return this.defaultUrl;
  //   }
  //   return this.banners[this.index].bannerUrl;
  // }

  // rotate(): void {
  //   setTimeout(() => {
  //     if (this.banners.length) {
  //       setInterval(() => {
  //         this.index != this.banners.length - 1
  //           ? this.index++
  //           : (this.index = 0);
  //       }, 7000);
  //     } else {
  //       this.index = 0;
  //     }
  //   }, 7000);
  // }

  get clickUrl(): string {
    if (!this.banners.length) return "";
    return this.banners[this.index].clickUrl;
  }

  get defaultUrl(): string {
    return `/tmp/${this.position}-banner.jpg`;
  }

  onClick(): void {
    if (!this.banners[this.index]) return;

    if (this.banners[this.index].clickUrl) {
      // TODO: handle click url (might be external link)
      console.log("ad:clickUrl =>", this.banners[this.index].clickUrl);
    }
    if (this.banners[this.index].idx) {
      ApiService.instance.open({
        path: `/advertisement/view/${this.banners[this.index].idx}`,
      });
    }
  }
}
</script>
