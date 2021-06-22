<template>
  <div class="banner pointer" :class="type" @click="onClick">
    <img class="w-100" :src="src" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["type", "defaultUrl", "position"],
})
export default class AdvertisementBanner extends Vue {
  type!: string;
  defaultUrl!: string;
  position!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get banners(): AdvertisementModel[] {
    return store.state.banners.filter((a) => {
      if (a.code != this.type) return false;
      if (a.subcategory != store.state.currentCategory) return false;
      return true;
    });
  }

  get src(): string {
    if (!this.banners.length || !this.banners[this.index]) {
      return this.defaultUrl ?? "";
    }
    return this.banners[this.index].bannerUrl;
  }

  get clickUrl(): string {
    if (!this.banners.length) return "";
    return this.banners[this.index].clickUrl;
  }

  rotate(): void {
    setInterval(() => {
      if (this.banners.length) {
        this.index != this.banners.length - 1 ? this.index++ : (this.index = 0);
      } else {
        this.index = 0;
      }
    }, 7000);
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
