<template>
  <div v-if="banners.length">
    <AdvertisementLineBanner
      class="mt-2 p-1"
      v-for="banner of banners"
      :key="banner.idx"
      :banner="banner"
    ></AdvertisementLineBanner>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Banner } from "@/x-vue/interfaces/advertisement.interface";
import AdvertisementLineBanner from "@/x-vue/widgets/advertisement/AdvertisementLineBanner.vue";

@Component({
  components: { AdvertisementLineBanner },
})
export default class AdvertisementLineBannerList extends Vue {
  @Prop({ default: () => [] }) banners!: Banner[];
}
</script>
