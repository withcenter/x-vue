<template>
  <div class="mt-2 banner square pointer" @click="onClick(currentBanner)" v-if="currentBanner">
    <img class="w-100 h-100" :src="currentBanner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner, AllCategoryBanners } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import { advKey } from "@/service/functions";

@Component({})
export default class AdvertisementSidebarBanner extends Vue {
  @Prop() banners!: AllCategoryBanners;
  @Prop() categoryId!: string;
  @Prop() countryCode!: string;

  index = 0;

  mounted(): void {
    this.rotate();
  }

  get currentBanner(): Banner | undefined {
    const items = this.banners[advKey("sidebar", this.categoryId)];

    if (items) {
      return items[this.index % items.length];
    } else {
      return undefined;
    }
  }

  rotate(): void {
    setInterval(() => this.index++, 7000);
  }

  onClick(): void {
    if (this.currentBanner) {
      AdvertisementService.instance.openAdvertisement(this.currentBanner);
    }
  }
}
</script>
