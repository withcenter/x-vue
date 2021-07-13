<template>
  <section>
    <h1>{{ "point_history" | t }}</h1>
    <div>{{ "count" | t }}: {{ pointHistories.length }}</div>
    <div>{{ "point_added" | t }}: {{ summary.total_point_apply_increase }}</div>
    <div>{{ "point_decrease" | t }}: {{ summary.total_point_apply_decrease }}</div>

    <label>{{ "begin_end_date" | t }}</label>
    <div class="d-flex justify-content-between">
      <label>
        {{ "begin_date" | t }}
        <input v-model="options.beginDate" type="date" :min="beginAtMin" :max="beginAtMax" @change="search" />
      </label>
      <label>
        {{ "end_date" | t }}
        <input v-model="options.endDate" type="date" :min="endAtMin" :max="endAtMax" @change="search" />
      </label>
    </div>

    <section class="overflow-auto mb-3">
      <b-table
        table-class="text-center text-nowrap"
        small
        striped
        hover
        :items="pointHistories"
        :fields="visibleFields"
        :busy="loading"
        :bordered="true"
        responsive="true"
        head-variant="dark"
      >
        <template #head()="scope">
          <div class="text-nowrap">{{ scope.label | t }}</div>
        </template>

        <template #cell(action)="row">
          {{ getAction(row.item) }}
        </template>

        <template #cell(taxonomy)="row">
          <router-link :to="'/' + row.item.entity"
            >{{ row.item.taxonomy }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg
          ></router-link>
        </template>

        <template #cell(fromUserPointApply)="row">
          {{ pointApply(row.item) }}
        </template>

        <template #cell(fromUserPointAfter)="row">
          {{ pointAfter(row.item) }}
        </template>

        <template #cell(createdAt)="row">
          {{ date(row.item.createdAt) }}
        </template>

        <template #table-busy>
          <Loading></Loading>
        </template>
      </b-table>
    </section>

    <div class="alert alert-info" v-if="!pointHistories.length">{{ "no_records_found" | t }}</div>
  </section>
</template>

<script lang="ts">
import { PointHistoryModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import { yymmddhma } from "@/x-vue/services/functions";
import dayjs from "dayjs";
import { Component, Vue } from "vue-property-decorator";
import Loading from "@/x-vue/widgets/common/Loading.vue";

import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";
@Component({
  components: {
    Loading,
    BoxArrowUpRightSvg,
  },
})
export default class PointHistory extends Vue {
  pointHistories: Array<PointHistoryModel> = [];

  loading = false;

  beginAtMin = "";
  beginAtMax = dayjs().format("YYYY-MM-DD");

  endAtMin = "";
  endAtMax = this.beginAtMax;

  options = {
    beginDate: dayjs().hour(-24).format("YYYY-MM-DD"),
    endDate: this.beginAtMax,
  };

  summary = {
    total_point_apply_increase: 0,
    total_point_apply_decrease: 0,
  };

  fields: Array<{ [index: string]: unknown }> = [
    { key: "action", visible: true },
    { key: "taxonomy", visible: true },
    { key: "fromUserPointApply", label: "point_apply", visible: true },
    { key: "fromUserPointAfter", label: "point_after", visible: true },
    { key: "createdAt", label: "Date", visible: true },
  ];

  get visibleFields(): Array<{ [index: string]: unknown }> {
    return this.fields.filter((field) => field.visible);
  }

  mounted(): void {
    console.log("PointHistory::");
    this.search();
  }

  async search(): Promise<void> {
    // get the days difference
    // negative - end date is lower than the begin date
    // return if the end date is lower than the begin date
    let days = dayjs(this.options.endDate).diff(dayjs(this.options.beginDate), "d");
    if (days < 0) return;

    // show error if days difference is morethan 90days
    if (days > 90) ComponentService.instance.alert("date range", "error_more_than_90days_date_difference");

    if (this.loading) return;
    this.loading = true;

    try {
      this.pointHistories = await ApiService.instance.userPointHistory(this.options);
      this.summary.total_point_apply_increase = 0;
      this.summary.total_point_apply_decrease = 0;
      const $myIdx = this.$app.user.idx;
      for (const h of this.pointHistories) {
        let point = 0;
        if ($myIdx == h.fromUserIdx) {
          point = h.fromUserPointApply;
        } else if ($myIdx == h.toUserIdx) {
          point = h.toUserPointApply;
        }

        if (point > 0) {
          this.summary.total_point_apply_increase += point;
        } else {
          this.summary.total_point_apply_decrease += point;
        }
      }

      console.log(this.pointHistories);
    } catch (e) {
      this.$emit("error", e);
    }
    this.loading = false;
  }

  pointApply(h: PointHistoryModel): number {
    if (h.fromUserIdx == this.$app.user.idx) return h.fromUserPointApply;
    if (h.toUserIdx == this.$app.user.idx) return h.toUserPointApply;
    return 0;
  }
  pointAfter(h: PointHistoryModel): number {
    if (h.fromUserIdx == this.$app.user.idx) return h.fromUserPointAfter;
    if (h.toUserIdx == this.$app.user.idx) return h.toUserPointAfter;
    return 0;
  }

  date(s: number): string {
    return yymmddhma(s);
  }

  getAction(h: PointHistoryModel): string {
    if (h.action == "dislike" && h.fromUserIdx == this.$app.user.idx) return "dislike_deduction";

    if (h.action == "like" && h.fromUserIdx == this.$app.user.idx) return "like_deduction";

    return h.action;
  }
}
</script>
