<template>
  <div class="banner pointer" :class="type" @click="onClick" v-if="src">
    <img class="w-100" :src="src" />
  </div>
</template>

<script lang="ts">
import { Banner } from "@/x-vue/services/interfaces";
import Component from "vue-class-component";
import Vue from "vue";
import store from "@/store";

@Component({
  props: ["type", "defaultUrl"],
})
export default class AdvertisementBanner extends Vue {
  type!: string;
  defaultUrl!: string;

  index = 0;

  mounted(): void {
    // this.rotate();
  }

  get banners(): Banner[] {
    let category = store.state.currentCategory;

    /// if 'currentCategory' is empty, check global banners.
    if (!store.state.banners[category]) category = "global";

    /// if 'global' banner is empty, return empty.
    if (!store.state.banners[category]) return [];

    if (!store.state.banners[category][this.type]) return [];
    else return store.state.banners[category][this.type];
  }

  get src(): string {
    if (!this.banners.length) return this.defaultUrl ?? "";
    return this.banners[this.index % this.banners.length].bannerUrl;
  }

  get clickUrl(): string {
    if (!this.banners.length) return "";
    return this.banners[this.index].clickUrl;
  }

  rotate() {
    setInterval(() => this.index++, 7000);
  }
  onClick(): void {
    console.log("TODO: on advertisement click");
  }
}
</script>
