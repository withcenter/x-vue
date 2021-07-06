<template>
  <section>
    <h1>Point History</h1>

    <div>Search</div>
    <div>Result count: {{ pointHistories.length }}</div>
    <div>Point Added: {{ summary.total_point_apply_increase }}</div>
    <div>Point Deducted: {{ summary.total_point_apply_decrease }}</div>
    <!-- <div>Point Difference: {{ summary.total_point_apply_increase + summary.total_point_apply_decrease }}</div> -->

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

    <table class="table table-striped mt-2 text-center">
      <thead class="thead-dark">
        <tr class="fs-sm">
          <th scope="col">{{ "action" | t }}</th>
          <th scope="col">{{ "taxonomy" | t }}</th>
          <th scope="col">{{ "point_apply" | t }}</th>
          <th scope="col">{{ "point_after" | t }}</th>
          <th scope="col">{{ "Date" | t }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history of pointHistories" :key="history.idx">
          <td>
            {{ getAction(history) }}
          </td>
          <td>
            <router-link :to="'/' + history.entity">{{ history.taxonomy }}</router-link>
          </td>
          <td>
            {{ pointApply(history) }}
          </td>
          <td>
            {{ pointAfter(history) }}
          </td>
          <td>
            {{ date(history.createdAt) }}
          </td>
        </tr>
      </tbody>
      <!-- <div class="my-3 alert alert-info">{{ "point_history_help" | t }}</div> -->
    </table>
  </section>
</template>

<script lang="ts">
import { PointHistoryModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { yymmddhma } from "@/x-vue/services/functions";
import dayjs from "dayjs";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class PointHistory extends Vue {
  pointHistories: Array<PointHistoryModel> = [];

  beginAtMin = dayjs()
    .hour(-90 * 24)
    .format("YYYY-MM-DD");
  beginAtMax = dayjs().hour(23).format("YYYY-MM-DD");

  endAtMin = this.beginAtMin;
  endAtMax = this.beginAtMax;

  options = {
    beginDate: dayjs().hour(0).format("YYYY-MM-DD"),
    endDate: dayjs().hour(23).format("YYYY-MM-DD"),
  };

  summary = {
    total_point_apply_increase: 0,
    total_point_apply_decrease: 0,
  };

  mounted(): void {
    this.search();
  }

  async search(): Promise<void> {
    // console.log(".diff(dayjs(", dayjs(this.options.beginDate).diff(dayjs(this.options.endDate), "d"));
    //return if endDate is earlier than the beginDate
    if (dayjs(this.options.beginDate).diff(dayjs(this.options.endDate), "d") > 0) return;
    // console.log("search():", this.options);
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

      // console.log(this.pointHistories);
    } catch (e) {
      this.$emit("error", e);
    }
    return;
  }

  pointApply(h: PointHistoryModel) {
    if (h.fromUserIdx == this.$app.user.idx) return h.fromUserPointApply;
    if (h.toUserIdx == this.$app.user.idx) return h.toUserPointApply;
    return 0;
  }
  pointAfter(h: PointHistoryModel) {
    if (h.fromUserIdx == this.$app.user.idx) return h.fromUserPointAfter;
    if (h.toUserIdx == this.$app.user.idx) return h.toUserPointAfter;
    return 0;
  }

  date(s: number) {
    return yymmddhma(s);
  }

  getAction(h: PointHistoryModel) {
    if (h.action == "dislike" && h.toUserIdx == this.$app.user.idx) return "dislike deduction";
    return h.action;
  }
}
</script>
