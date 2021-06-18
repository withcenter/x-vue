<template>
  <div class="banner" :class="type" v-if="src">
    <img class="w-100" :src="src" />
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["type"],
})
export default class AdvertisementBanner extends Vue {
  type!: string;

  api = ApiService.instance;

  index = 0;
  banners: AdvertisementModel[] = [];

  async mounted(): Promise<void> {
    this.banners = await this.api.advertisementSearch({
      code: this.type,
      countryCode: "PH",
      files: true,
    });

    console.log(`${this.type} banners =>`, this.banners);

    if (this.banners.length) {
      setInterval(() => {
        if (this.index == this.banners.length - 1) {
          this.index = 0;
        } else {
          this.index++;
        }
      }, 7000);
    }
  }

  get src(): string {
    if (!this.banners.length) return "";
    return this.banners[this.index].files[0].url;
  }
}
</script>
