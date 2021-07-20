<template>
  <div class="box mb-2" v-if="advertisement.isActive || advertisement.isWaiting">
    {{ advertisement.pointPerDay }}
    <div class="d-flex">
      <span>
        {{ "adv_advertisement_type" | t }}
        <h2>{{ advertisement.code }}</h2>
      </span>
      <span class="ml-4">
        {{ "country" | t }}
        <h2>{{ countryName }}</h2>
      </span>
      <span class="ml-4">
        {{ "status" | t }}
        <h2>{{ advertisement.status }}</h2>
      </span>
    </div>
    <div class="mt-3">
      {{ "adv_advertisement_dates" | t }}
      <h2>{{ advertisement.beginDate }} ~ {{ advertisement.endDate }}</h2>
    </div>

    <div class="mt-3">
      <div class="alert alert-info">
        <div class="d-flex">
          <span class="mr-3">
            {{ "adv_no_of_days" | t }}: <b>{{ noOfDays }}</b>
          </span>
          <span class="mr-3">
            {{ "advertisement_serving_days" | t }}:
            <b>{{ servingDaysLeft }}</b>
          </span>
        </div>
        <div class="d-flex mt-2">
          <span class="mr-3">
            {{ "adv_points_per_day" | t }}:
            <b>{{ advertisement.pointPerDay }}</b>
          </span>
          <span>
            {{ "adv_refundable_points" | t }}:
            <b>{{ refundablePoints }}</b>
          </span>
        </div>
        <small class="text-info">
          {{ "adv_refundable_points_hint" | t }}
        </small>
      </div>
      <button
        class="w-100 btn btn-outline-danger"
        type="button"
        v-if="isCancellable || isRefundable"
        @click="$emit('onClickStop')"
      >
        {{ (isCancellable ? "cancel_advertisement" : "stop_advertisement") | t }}
      </button>
      <small class="text-info" v-if="isDue">
        This advertisement is already expired, you can stop it if you want to reset the dates and to start it again.
        <br />
        Stopping this advertisement will not cost anything, you will not also get a refund since it is already expired.
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import dayjs from "dayjs";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class AdvertisementActivePanel extends Vue {
  @Prop() advertisement!: AdvertisementModel;
  @Prop() isRefundable!: boolean;
  @Prop() refundablePoints!: number;
  @Prop() servingDaysLeft!: number;
  @Prop() noOfDays!: number;
  @Prop() countryName!: string;

  /**
   * Will return false if:
   *  - 'beginDate' is equivalent as tomorrow or beyond.
   *
   * @returns boolean
   */
  get isCancellable(): boolean {
    return dayjs().isBefore(this.advertisement.beginDate, "day");
  }

  get isDue(): boolean {
    return dayjs().isAfter(this.advertisement.endDate, "d");
  }
}
</script>
