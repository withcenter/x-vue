<template>
  <div>
    <div class="d-flex">
      <div class="overflow-hidden mr-2">
        <div>
          <span class="mr-2">No. {{ advertisement.idx }}</span> •
          <span class="badge badge-success ml-2" v-if="advertisement.isActive"> Active </span>
          <span class="badge badge-warning ml-2" v-if="advertisement.isInactive"> Inactive </span>
          <span class="badge badge-info ml-2" v-if="advertisement.isWaiting"> Waiting </span>
          <span class="badge badge-secondary ml-2" v-if="advertisement.code">
            {{ advertisement.code }}
          </span>
          <span class="badge badge-primary ml-2">
            {{ advertisement.subcategory ? advertisement.subcategory : "global" }}
          </span>
        </div>
        <div class="title text-truncate font-weight-bold">
          {{ advertisement.title ? advertisement.title : "No title .." }}
        </div>
        <div class="content">
          {{ advertisement.content ? advertisement.content : "No content .." }}
        </div>
      </div>
      <span class="flex-grow-1"></span>
      <div class="p-1" v-for="file of advertisement.files" :key="file.idx">
        <img style="height: 90px; width: 90px" :src="file.url" :alt="file.name" />
      </div>
    </div>
    <span @click.prevent="as.openAdvertisement({ idx: advertisement.idx })">
      {{ "view" | t }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.content {
  overflow: hidden;
  max-height: 3em;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";

@Component({
  components: { BoxArrowUpRightSvg },
})
export default class AdvertisementPreview extends Vue {
  @Prop() advertisement!: AdvertisementModel;
}
</script>
