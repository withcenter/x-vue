<template>
  <div class="banner square pointer" @click="onClick(banner)" v-if="banner">
    <img class="w-100 h-100" :src="banner.bannerUrl" />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({})
export default class AdvertisementSquareBanner extends Vue {
  @Prop() banner!: Banner;

  onClick(): void {
    AdvertisementService.instance.openAdvertisement(this.banner);
  }
}
</script>
