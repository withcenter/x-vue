<template>
  <div class="mt-3 box fs-sm" v-if="togglePointTable">
    <div class="d-flex justify-content-between">
      <div>{{ "adv_point_listing" | t }}</div>
      <div class="btn btn-link btn-sm" @click="togglePointTable = !togglePointTable">Hide</div>
    </div>
    <div>
      You are posting advertisement under {{ cafeCountryCode }} - <b>{{ countryName }}</b
      >, and the table below is the points of banner type.
    </div>
    <table class="w-100 mt-2 table table-striped" v-if="!isEmptyObj(bannerPoints)">
      <thead>
        <tr class="table-header">
          <th scope="col">{{ "adv_banner_type" | t }}</th>
          <th scope="col">{{ "adv_points_per_day" | t }}</th>
          <th scope="col">{{ "adv_points_for_30_days" | t }}</th>
          <th scope="col" v-if="settings.globalBannerMultiplying">
            {{ "global_adv_price" | t }}
          </th>
          <th scope="col" v-if="settings.globalBannerMultiplying">
            {{ "global_adv_price_for_30_days" | t }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, name) in bannerPoints" :key="name">
          <td>{{ name }}</td>
          <td>{{ numberWithCommas(value) }}</td>
          <td>{{ numberWithCommas(value * 30) }}</td>
          <td v-if="settings.globalBannerMultiplying">
            {{ numberWithCommas(value * settings.globalBannerMultiplying) }}
          </td>
          <td v-if="settings.globalBannerMultiplying">
            {{ numberWithCommas(value * settings.globalBannerMultiplying * 30) }}
          </td>
        </tr>
      </tbody>
    </table>
    <small class="text-info">
      {{ "adv_point_listing_hint" | t }} <br />
      {{ "adv_point_listing_hint_b" | t }}
    </small>
  </div>
  <div class="btn btn-link btn-sm" v-else @click="togglePointTable = !togglePointTable">Show advertisement point</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { AdvertisementSettings, ResponseData } from "@/x-vue/interfaces/interfaces";
import { isEmptyObject, numberWithCommas } from "@/x-vue/services/functions";

@Component({})
export default class BannerPointListingTable extends Vue {
  @Prop() settings!: AdvertisementSettings;
  @Prop() bannerPoints!: ResponseData;
  @Prop() cafeCountryCode!: string;
  @Prop() countryName!: string;

  togglePointTable = false;

  isEmptyObj(x: unknown): boolean {
    return isEmptyObject(x);
  }

  numberWithCommas(x: number): string {
    return numberWithCommas(x);
  }
}
</script>
