<template>
  <section>
    <h1>Point History</h1>

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
            {{ history.action }}
          </td>
          <td>
            {{ history.taxonomy }}
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
    </table>
  </section>
</template>

<script lang="ts">
import { PointHistoryModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import dayjs from "dayjs";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class PointHistory extends Vue {
  pointHistories: Array<PointHistoryModel> = [];
  async mounted(): Promise<void> {
    console.log("PointHistory::");

    try {
      this.pointHistories = await ApiService.instance.userPointHistory();
      console.log(this.pointHistories);
    } catch (e) {
      this.$emit("error", e);
    }
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
    return dayjs(s * 1000).format("YY-MM-DD h:ma");
  }
}
</script>
