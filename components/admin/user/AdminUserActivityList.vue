<template>
  <section>
    <h1>Point History</h1>

    <div>Search</div>
    <div>Result count: {{ pointHistories.length }}</div>
    <form @submit.prevent="search()">
      <div>User Idx<input type="text" v-model="options.idx" /></div>

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
      <button class="btn btn-primary" type="submit">Search</button>
    </form>
    <section class="overflow-auto">
      <table class="table table-striped mt-2 text-center">
        <thead class="thead-dark">
          <tr class="fs-sm">
            <th scope="col">{{ "action" | t }}</th>
            <th scope="col">{{ "taxonomy" | t }}</th>
            <th scope="col">{{ "from_user" | t }}</th>
            <th scope="col">{{ "from_point_apply" | t }}</th>
            <th scope="col">{{ "from_point_after" | t }}</th>

            <th scope="col">{{ "to_user" | t }}</th>
            <th scope="col">{{ "to_point_apply" | t }}</th>
            <th scope="col">{{ "to_point_after" | t }}</th>
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
              <router-link :to="'/admin/user/edit/' + history.fromUserIdx">
                ({{ history.fromUserIdx }}) {{ history.fromUser.nickname }}
              </router-link>
            </td>
            <td>
              {{ history.fromUserPointApply }}
            </td>
            <td>
              {{ history.fromUserPointAfter }}
            </td>
            <td>
              <router-link :to="'/admin/user/edit/' + history.toUserIdx">
                ({{ history.toUserIdx }}) {{ history.toUser.nickname }}
              </router-link>
            </td>
            <td>
              {{ history.toUserPointApply }}
            </td>
            <td>
              {{ history.toUserPointAfter }}
            </td>

            <td>
              {{ date(history.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="alert alert-info" v-if="!pointHistories.length">No Results.</div>
    </section>
  </section>
</template>

<script lang="ts">
import { UserActivityModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import dayjs from "dayjs";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class AdminUserActivityList extends Vue {
  pointHistories: Array<UserActivityModel> = [];

  beginAtMin = "";
  beginAtMax = dayjs().hour(23).format("YYYY-MM-DD");

  endAtMin = this.beginAtMin;
  endAtMax = this.beginAtMax;

  options = {
    beginDate: dayjs().hour(0).format("YYYY-MM-DD"),
    endDate: dayjs().hour(23).format("YYYY-MM-DD"),
  };

  mounted(): void {
    this.search();
  }

  async search(): Promise<void> {
    if (dayjs(this.options.beginDate).diff(dayjs(this.options.endDate), "d") > 0) return;
    console.log("search():", this.options);

    try {
      this.pointHistories = await ApiService.instance.userActivityList(this.options);

      console.log(this.pointHistories);
    } catch (e) {
      this.$emit("error", e);
    }
    return;
  }

  date(s: number) {
    return dayjs(s * 1000).format("YY-MM-DD h:ma");
  }
}
</script>
