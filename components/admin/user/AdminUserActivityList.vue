<template>
  <section class="pb-3">
    <h1>Point History</h1>

    <div>Search</div>
    <div>Result count: {{ pointHistories.length }}</div>
    <form class="mb-3" @submit.prevent="search()">
      <div class="d-flex">
        <input class="form-control mb-2" type="text" v-model="options.idx" :placeholder="'user_idx' | t" />
        <button class="btn btn-primary ml-3 mb-2 w-50" type="submit">
          {{ "search" | t }}
        </button>
      </div>

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
      <!-- <button class="btn btn-primary" type="submit">Search</button> -->
    </form>

    <div class="p-1 mb-3 border-radius-sm" style="border: 1px solid #e8e8e8">
      <div class="m-2">{{ "Fields" | t }}</div>
      <div
        class="custom-control custom-checkbox custom-control-inline m-2 fs-sm align-middle"
        v-for="(field, key) in fields"
        :key="key"
      >
        <input
          :data-cy="key + '-field'"
          type="checkbox"
          class="custom-control-input"
          :id="key + '-field'"
          v-model="fields[key]"
        />
        <label class="custom-control-label text-capitalize" :for="key + '-field'">{{ key }}</label>
      </div>
    </div>
    <section class="overflow-auto">
      <table class="table table-striped mt-2 text-center">
        <thead class="thead-dark">
          <tr class="fs-sm">
            <th scope="col" v-if="fields.idx">{{ "idx" | t }}</th>
            <th scope="col" v-if="fields.action">{{ "action" | t }}</th>
            <th scope="col" v-if="fields.taxonomy">{{ "taxonomy" | t }}</th>
            <th scope="col" v-if="fields.from_user">{{ "from_user" | t }}</th>
            <th scope="col" v-if="fields.from_point_apply">{{ "from_point_apply" | t }}</th>
            <th scope="col" v-if="fields.from_point_after">{{ "from_point_after" | t }}</th>
            <th scope="col" v-if="fields.to_user">{{ "to_user" | t }}</th>
            <th scope="col" v-if="fields.to_point_apply">{{ "to_point_apply" | t }}</th>
            <th scope="col" v-if="fields.to_point_after">{{ "to_point_after" | t }}</th>
            <th scope="col" v-if="fields.date">{{ "Date" | t }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history of pointHistories" :key="history.idx">
            <td v-if="fields.idx">
              {{ history.idx }}
            </td>
            <td v-if="fields.action">
              {{ history.action }}
            </td>
            <td v-if="fields.taxonomy">
              <a target="__blank" :href="'/' + history.entity">{{ history.taxonomy }}</a>
            </td>
            <td v-if="fields.from_user">
              <router-link :to="'/admin/user/edit/' + history.fromUserIdx">
                ({{ history.fromUserIdx }}) {{ history.fromUser.nickname }}
              </router-link>
            </td>
            <td v-if="fields.from_point_apply">
              {{ history.fromUserPointApply }}
            </td>
            <td v-if="fields.from_point_after">
              {{ history.fromUserPointAfter }}
            </td>
            <td v-if="fields.to_user">
              <router-link :to="'/admin/user/edit/' + history.toUserIdx">
                ({{ history.toUserIdx }}) {{ history.toUser.nickname }}
              </router-link>
            </td>
            <td v-if="fields.to_point_apply">
              {{ history.toUserPointApply }}
            </td>
            <td v-if="fields.to_point_after">
              {{ history.toUserPointAfter }}
            </td>

            <td v-if="fields.date">
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
import { yymmddhma } from "@/x-vue/services/functions";
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

  fields = {
    idx: false,
    action: true,
    taxonomy: true,
    from_user: true,
    from_point_apply: true,
    from_point_after: false,
    to_user: true,
    to_point_apply: true,
    to_point_after: false,
    date: true,
  };

  mounted(): void {
    this.search();
  }

  async search(): Promise<void> {
    if (dayjs(this.options.beginDate).diff(dayjs(this.options.endDate), "d") > 0) return;
    // console.log("search():", this.options);
    try {
      this.pointHistories = await ApiService.instance.userActivityList(this.options);
      //   console.log(this.pointHistories);
    } catch (e) {
      this.$emit("error", e);
    }
    return;
  }

  date(s: number) {
    return yymmddhma(s);
  }
}
</script>
