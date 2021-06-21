<template>
  <div class="banner" :class="type" v-if="src">
    <img class="w-100" :src="src" />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { AdvertisementModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["type"],
})
export default class AdvertisementBanner extends Vue {
  type!: string;

  index = 0;
  get banners(): AdvertisementModel[] {
    return store.state.banners;
  }

  get src(): string {
    if (!this.banners.length) return "";
    return this.banners[this.index].files[0].url;
  }
}
</script>
