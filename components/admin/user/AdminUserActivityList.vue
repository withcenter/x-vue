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
      <b-checkbox
        size="sm"
        :disabled="visibleFields.length == 1 && field.visible"
        v-for="field in fields"
        :key="field.key"
        v-model="field.visible"
        inline
      >
        {{ field.label || field.key | t }}
      </b-checkbox>
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
      >
        <template #head()="scope">
          <div class="text-nowrap">{{ scope.label | t }}</div>
        </template>

        <template #cell(taxonomy)="row">
          <router-link :to="'/' + row.item.entity"
            >{{ row.item.taxonomy }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg
          ></router-link>
        </template>

        <template #cell(fromUser)="row">
          <UserAvatarWithInfo
            v-if="row.item.fromUserIdx"
            class="text-left"
            :user="row.item.fromUser"
          ></UserAvatarWithInfo>
        </template>

        <template #cell(toUser)="row">
          <UserAvatarWithInfo v-if="row.item.toUserIdx" class="text-left" :user="row.item.toUser"></UserAvatarWithInfo>
        </template>

        <template #cell(createdAt)="row">
          {{ date(row.item.createdAt) }}
        </template>

        <template #table-busy>
          <Loading></Loading>
        </template>
      </b-table>

      <div class="alert alert-info" v-if="!pointHistories.length">No records found.</div>
    </section>
  </section>
</template>

<script lang="ts">
import { UserActivityModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { yymmddhma } from "@/x-vue/services/functions";
import dayjs from "dayjs";
import { Component, Vue } from "vue-property-decorator";
import UserAvatarWithInfo from "@/x-vue/widgets/common/UserAvatarWithInfo.vue";
import Loading from "@/x-vue/widgets/common/Loading.vue";

import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";
@Component({
  components: {
    UserAvatarWithInfo,
    Loading,
    BoxArrowUpRightSvg,
  },
})
export default class AdminUserActivityList extends Vue {
  pointHistories: Array<UserActivityModel> = [];

  beginAtMin = "";
  beginAtMax = dayjs().format("YYYY-MM-DD");

  endAtMin = this.beginAtMin;
  endAtMax = this.beginAtMax;

  options = {
    beginDate: dayjs().hour(-24).format("YYYY-MM-DD"),
    endDate: this.beginAtMax,
  };

  loading = false;

  fields: Array<{ [index: string]: unknown }> = [
    { key: "idx", visible: false },
    { key: "action", visible: true },
    { key: "taxonomy", visible: true },
    { key: "fromUser", visible: true, class: "text-nowrap" },
    { key: "fromUserPointApply", label: "From point apply", visible: true },
    { key: "fromUserPointAfter", visible: false },
    { key: "toUser", visible: true, class: "text-nowrap" },
    { key: "toUserPointApply", label: "To point apply", visible: true },
    { key: "toUserPointAfter", visible: false },
    { key: "createdAt", label: "Date", visible: true },
  ];

  get visibleFields(): Array<{ [index: string]: unknown }> {
    return this.fields.filter((field) => field.visible);
  }

  mounted(): void {
    this.search();
  }

  async search(): Promise<void> {
    if (dayjs(this.options.beginDate).diff(dayjs(this.options.endDate), "d") > 0) return;

    if (this.loading) return;
    this.loading = true;
    // console.log("search():", this.options);
    try {
      this.pointHistories = await ApiService.instance.userActivityList(this.options);
      //   console.log(this.pointHistories);
    } catch (e) {
      this.$emit("error", e);
    }
    this.loading = false;
  }

  date(s: number): string {
    return yymmddhma(s);
  }
}
</script>
