<template>
  <div>
    <h4>{{ "Users" | t }}</h4>
    <div class="d-flex justify-content-end mb-3">
      <div class="mt-2 fw-700">{{ "no_of_users" | t }}: {{ total }}</div>

      <span class="flex-grow-1"></span>

      <form @submit.prevent="onSubmitSearch">
        <div class="form-row align-items-center">
          <div class="col-auto">
            <input
              type="text"
              class="form-control mb-2"
              name="searchKey"
              :placeholder="'enter_email_address_or_name' | t"
              v-model="searchKey"
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary mb-2">
              {{ "submit" | t }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div>
      <div class="p-1 mb-3 border-radius-sm" style="border: 1px solid #e8e8e8">
        <!-- <div class="m-2">{{ "fields" | t }}</div> -->
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
          small
          striped
          hover
          :items="users"
          :fields="visibleFields"
          :busy="loading"
          :bordered="true"
          responsive="true"
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle mr-2"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
        </b-table>
      </section>
    </div>

    <!-- <router-link
                  data-cy="user-info-edit-button"
                  class="btn btn-sm btn-outline-primary"
                  :to="editLink(user)"
                >
                  {{ "edit" | t }}
                </router-link> -->
    <div class="overflow-auto">
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

@Component({})
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
    { key: "email", visible: true },
    { key: "firebaseUid", visible: false },
    { key: "name", visible: true },
    { key: "nickname", visible: true },
    { key: "point", visible: true },
    { key: "phoneNo", visible: true },
    { key: "gender", visible: true },
    { key: "birthdate", visible: false },
    { key: "countryCode", visible: false },
    { key: "city", visible: false },
    { key: "address", visible: false },
    { key: "zipcode", visible: false },
    { key: "createdAt", visible: false },
    { key: "updatedAt", visible: false },
    {
      key: "action",
      visible: true,
    },
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
