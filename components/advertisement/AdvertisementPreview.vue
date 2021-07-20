<template>
  <div>
    <div class="d-flex">
      <div class="overflow-hidden mr-2">
        <div>
          <span class="mr-2">No. {{ advertisement.idx }}</span> •
          <span class="badge badge-success ml-2">
            {{ advertisement.countryCode }}
          </span>
          <span class="badge badge-success ml-2" v-if="advertisement.isActive"> {{ "active" | t }} </span>
          <span class="badge badge-warning ml-2" v-if="advertisement.isInactive"> {{ "inactive" | t }} </span>
          <span class="badge badge-info ml-2" v-if="advertisement.isWaiting"> {{ "waiting" | t }} </span>
          <span class="badge badge-secondary ml-2" v-if="advertisement.code">
            {{ advertisement.code }}
          </span>
          <span class="badge badge-primary ml-2">
            {{ advertisement.subcategory ? advertisement.subcategory : "global" | t }}
          </span>
        </div>
        <div class="title text-truncate font-weight-bold">
          {{ advertisement.title ? advertisement.title : "no_title" | t }}
        </div>
        <div class="content text-truncate">
          {{ advertisement.content ? advertisement.content : "no_content" | t }}
        </div>
        <div class="memo text-truncate">
          {{ "memo" | t }} : {{ advertisement.privateContent ? advertisement.privateContent : "no_memo" | t }}
        </div>
      </div>
      <span class="flex-grow-1"></span>
      <div class="p-1" v-for="file of advertisement.files" :key="file.idx">
        <img style="height: 90px; width: 90px" :src="file.url" :alt="file.name" />
      </div>
    </div>

    <!-- Begin and End date, points -->
    <div class="fs-sm alert alert-info p-2 mr-1 my-2">
      <div class="dates">
        <span class="mr-2">{{ "created_at" | t }}: {{ advertisement.shortDate }}</span>
        <span>{{ "advertisement_dates" | t }} :</span>
        <span v-if="advertisement.beginDate && advertisement.endDate">
          {{ advertisement.beginDate }} ~ {{ advertisement.endDate }}
        </span>
        <span v-else>{{ "dates_not_set" | t }}</span>
      </div>
      <div class="mt-2">
        <span class="points mr-2">
          {{ "point_per_day" | t }}: <b>{{ advertisement.pointPerDay }}</b>
        </span>
        <span>
          {{ "advertisement_point" | t }}: <b>{{ advertisement.advertisementPoint }}</b>
        </span>
      </div>
    </div>
    <span class="mr-4" @click.stop.prevent="as.openAdvertisement({ idx: advertisement.idx })">
      {{ "view_advertisement" | t }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg>
    </span>
    <span v-if="advertisement.clickUrl" @click.stop.prevent="as.openAdvertisement(advertisement)">
      {{ "click_url" | t }} : {{ advertisement.clickUrl }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";

@Component({
  components: { BoxArrowUpRightSvg },
})
export default class AdvertisementPreview extends Vue {
  @Prop() advertisement!: AdvertisementModel;
  as = AdvertisementService.instance;
}
</script>
