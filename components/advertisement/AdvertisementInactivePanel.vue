<template>
  <div class="mb-2" v-if="advertisement.isInactive">
    <div class="box" v-if="advertisement.code">
      {{ "adv_points_per_day" | t }}: <b>{{ bannerPoints[advertisement.code] }}</b> <br />
      <small class="text-info">
        {{ "adv_points_per_day_hint" | t }}
      </small>
    </div>

    <!-- banner start and end date -->
    <div class="form-group bg-light p-3 mt-3">
      <label>{{ "advertisement_begin_end_date" | t }}</label>
      <div class="d-flex justify-content-between">
        <label>
          {{ "adv_begin_date" | t }}
          <input
            v-model="advertisement.beginDate"
            type="date"
            :min="beginAtMin"
            :max="beginAtMax"
            :disabled="advertisement.isActive"
          />
        </label>
        <label>
          {{ "adv_end_date" | t }}
          <input
            v-model="advertisement.endDate"
            type="date"
            :min="endAtMin"
            :max="endAtMax"
            :disabled="advertisement.isActive"
          />
        </label>
      </div>

      <small class="form-text text-muted mb-2">
        {{ "advertisement_serving_days" | t }}:
        <b>{{ servingDaysLeft }}</b>
        {{ "days" | t }}
      </small>
      <small class="form-text text-muted mb-2"> {{ "adv_no_of_days" | t }}: {{ noOfDays }} </small>
      <small class="form-text text-muted">
        {{ "adv_no_of_days_hint_a" | t }}
      </small>
      <small class="form-text text-muted">
        {{ "adv_no_of_days_hint_b" | t }}
      </small>
      <small class="form-text text-muted">
        {{ "adv_no_of_days_hint_c" | t }}
      </small>
    </div>

    <!-- Total Advertisement price in points -->
    <div class="alert alert-info" v-if="priceInPoint">
      {{ "adv_total_points_required" | t }}: <b>{{ priceInPoint }}</b
      ><br />
      <small class="text-info">
        {{ "adv_total_points_required_hint" | t }}
      </small>
    </div>

    <!-- Start Advertisement -->
    <div class="mt-2">
      <button class="w-100 btn btn-outline-success" type="button" :disabled="!canStart" @click="$emit('onClickStart')">
        {{ "start_advertisement" | t }}
      </button>
      <div class="alert alert-danger mt-2" v-if="isPointInsufficient">
        <span v-if="isEmptyObj(bannerPoints)">{{ "point_setting_not_set" | t }}</span>
        <span v-else>{{ "start_advertisement_warning" | t }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import dayjs from "dayjs";

import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementSettings, ResponseData } from "@/x-vue/interfaces/interfaces";
import { isEmptyObject } from "@/x-vue/services/functions";

@Component({})
export default class AdvertisementInactivePanel extends Vue {
  @Prop() advertisement!: AdvertisementModel;
  @Prop() settings!: AdvertisementSettings;
  @Prop() bannerPoints!: ResponseData;
  @Prop() servingDaysLeft!: number;
  @Prop() noOfDays!: number;

  beginAtMin = "";

  mounted(): void {
    this.beginAtMin = dayjs().format("YYYY-MM-DD");
  }

  /**
   * @returns string - returns the minimum selectable date for the "endAt" input.
   */
  get endAtMin(): string {
    let d = dayjs();
    if (this.advertisement.beginDate) d = dayjs(this.advertisement.beginDate);
    return d.format("YYYY-MM-DD");
  }

  get endAtMax(): string {
    let d = dayjs();
    if (this.advertisement.beginDate) d = dayjs(this.advertisement.beginDate);
    if (this.settings.maximumAdvertisementDays > 0) {
      return d.add(this.settings.maximumAdvertisementDays - 1, "d").format("YYYY-MM-DD");
    }
    return "";
  }

  /**
   * @returns string - returns the maximum selectable date for the "beginAt" input.
   */
  get beginAtMax(): string {
    if (this.advertisement.endDate) return dayjs(this.advertisement.endDate).format("YYYY-MM-DD");
    return "";
  }

  /**
   * Will return false if :
   *  - User have insufficient point.
   *  - The advertisement date is due.
   *
   * @returns boolean
   */
  get canStart(): boolean {
    if (!this.advertisement.beginDate || !this.advertisement.endDate) return false;
    if (this.isPointInsufficient) return false;

    // Advertisement is due or expired.
    if (dayjs().isAfter(this.advertisement.endDate, "d")) return false;
    return true;
  }

  /**
   * Total price in point calculation.
   *
   * @returns number - returns the total point required to create the advertisement.
   */
  get priceInPoint(): number {
    if (!this.noOfDays) return 0;
    let bannerPrice = this.bannerPoints[this.advertisement.code];
    if (this.advertisement.subcategory == "" && this.settings.globalBannerMultiplying) {
      bannerPrice = bannerPrice * this.settings.globalBannerMultiplying;
    }

    return bannerPrice * this.noOfDays;
  }

  /**
   * Will return true if:
   *  - No logged in user.
   *  - Current user has 0 point.
   *  - No banner point settings is set.
   *  - User point is smaller than required point to create advertisement.
   *
   * @returns boolean
   */
  get isPointInsufficient(): boolean {
    if (!this.$store.state.user) return true;
    if (this.$store.state.point == 0) return true;
    if (isEmptyObject(this.bannerPoints)) return true;
    return this.$store.state.point < this.priceInPoint;
  }

  isEmptyObj(x: unknown): boolean {
    return isEmptyObject(x);
  }
}
</script>
