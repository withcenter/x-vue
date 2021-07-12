<template>
  <div>
    <h4>{{ "Users" | t }}</h4>
    <div class="mb-3">
      <div class="my-2 fw-700">{{ "no_of_users" | t }}: {{ total }}</div>
      <form @submit.prevent="onSubmitSearch">
        <b-row no-gutters>
          <b-col>
            <b-input-group class="pr-2" size="sm" prepend="limit">
              <b-form-input id="limit" v-model="limit" placeholder="limit"></b-form-input> </b-input-group
          ></b-col>
          <b-col cols="8">
            <b-input-group class="pr-2" size="sm" prepend="searchkey">
              <b-form-input
                id="searchKey"
                v-model="searchKey"
                :placeholder="'enter_email_address_or_name' | t"
              ></b-form-input> </b-input-group
          ></b-col>
          <b-col>
            <b-button type="submit" class="w-100" size="sm" variant="primary">{{ "submit" | t }}</b-button></b-col
          >
        </b-row>
      </form>
    </div>

    <div>
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
          table-class="text-center"
          small
          striped
          hover
          :items="users"
          :fields="visibleFields"
          :busy="loading"
          :bordered="true"
          responsive="true"
          head-variant="dark"
        >
          <template #head()="scope">
            <div class="text-nowrap">{{ scope.label | t }}</div>
          </template>
          <template #cell(user)="row">
            <UserAvatarWithInfo class="text-left" :user="row.item"></UserAvatarWithInfo>
          </template>

          <template #cell(block)="row">
            {{ row.item.block ? "block" : "active" | t }}
          </template>

          <template #cell(action)="row">
            <!-- <div class="d-flex justify-content-around text-nowrap"> -->
            <div class="pointer px-1" @click="row.toggleDetails">
              <BoxArrowInUpSvg v-if="row.detailsShowing"></BoxArrowInUpSvg>
              <BoxArrowInDownSvg v-else></BoxArrowInDownSvg>
            </div>
            <!-- <router-link class="px-1" :to="editLink(row.item)"><PencilSvg></PencilSvg></router-link>
            </div> -->
          </template>

          <template #row-details="row">
            <b-card body-class="p-1 text-left">
              <b-row>
                <b-col>idx: {{ row.item.idx }}</b-col>
                <b-col>name: {{ row.item.name }}</b-col>
                <b-col>nickname: {{ row.item.nickname }}</b-col>
              </b-row>
              <b-row>
                <b-col>email: {{ row.item.email }}</b-col>
                <b-col>phone: {{ row.item.phone }}</b-col>
                <b-col>gender: {{ row.item.gender }}</b-col>
              </b-row>

              <b-row>
                <b-col>city: {{ row.item.city }}</b-col>
                <b-col>countryCode: {{ row.item.countryCode }}</b-col>
                <b-col>birthdate: {{ row.item.birthdate }}</b-col>
              </b-row>
              <div>address: {{ row.item.address }}</div>
              <div>createdAt: {{ row.item.createdAt }}</div>
              <div>updatedAt: {{ row.item.updatedAt }}</div>
            </b-card>
          </template>

          <template #table-busy>
            <Loading variant="danger"></Loading>
          </template>
        </b-table>
      </section>
    </div>

    <div class="overflow-auto" v-if="noOfPages > 0">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="noOfPages"
        v-model="currentPage"
        v-on:change="onPageChanged"
        use-router
      ></b-pagination-nav>
    </div>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { UserModel } from "@/x-vue/interfaces/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import Service from "../../../services/component.service";

import PencilSvg from "@/x-vue/svg/PencilSvg.vue";
import BoxArrowInUpSvg from "@/x-vue/svg/BoxArrowInUpSvg.vue";
import BoxArrowInDownSvg from "@/x-vue/svg/BoxArrowInDownSvg.vue";

import UserAvatarWithInfo from "@/x-vue/widgets/common/UserAvatarWithInfo.vue";
import Loading from "@/x-vue/widgets/common/Loading.vue";
@Component({
  components: {
    Loading,
    UserAvatarWithInfo,
    PencilSvg,
    BoxArrowInUpSvg,
    BoxArrowInDownSvg,
  },
})
export default class AdminUserList extends Vue {
  s = Service.instance;
  users: Array<UserModel> = [];
  total = 0;

  limit = 5;
  searchKey = "";
  noOfPages = 10;
  currentPage = "1";

  loading = false;

  fields: Array<{ [index: string]: unknown }> = [
    { key: "user", visible: true },
    { key: "firebaseUid", visible: false },
    { key: "nickname", visible: true },
    { key: "point", visible: true, sortable: true },
    { key: "phoneNo", visible: true },
    { key: "gender", visible: false },
    { key: "birthdate", visible: false },
    { key: "countryCode", label: "country_code", visible: false },
    { key: "province", visible: false },
    { key: "city", visible: false },
    { key: "address", visible: false },
    { key: "zipcode", visible: false },
    { key: "createdAt", label: "Registered", visible: false },
    { key: "updatedAt", label: "Updated", visible: false },
    { key: "block", label: "Status", visible: true, sortable: true },
    { key: "action", visible: true, class: "text-center" },
  ];

  get visibleFields(): Array<{ [index: string]: unknown }> {
    return this.fields.filter((field) => field.visible);
  }

  editLink(user: UserModel): string {
    return "/admin/user/edit/" + user.idx + window.location.search;
  }

  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    this.currentPage = "" + page;
    this.onSubmitSearch();
  }

  mounted(): void {
    // console.log("mounted(): void {::", this.currentPage);
    this.currentPage = this.$route.query.page ? (this.$route.query.page as string) : "1";
    this.onSubmitSearch();
  }

  async onSubmitSearch(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    try {
      this.users = await ApiService.instance.userSearch({
        searchKey: this.searchKey,
        limit: this.limit,
        page: this.currentPage,
        full: true,
      });

      this.total = await ApiService.instance.userCount({
        searchKey: this.searchKey,
      });
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      this.s.error(e);
    }
    this.loading = false;
  }
}
</script>
