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

    <div v-if="users">
      <div class="p-1 mb-3 border-radius-sm" style="border: 1px solid #e8e8e8">
        <div class="m-2">{{ "Fields" | t }}</div>
        <div
          class="custom-control custom-checkbox custom-control-inline m-2 fs-sm align-middle"
          v-for="(option, key) in options"
          :key="key"
        >
          <input
            :data-cy="key + '-option'"
            type="checkbox"
            class="custom-control-input"
            :id="key + '-option'"
            v-model="options[key]"
          />
          <label class="custom-control-label text-capitalize" :for="key + '-option'">{{ key }}</label>
        </div>
      </div>
      <section class="overflow-auto">
        <table class="table table-striped fs-sm">
          <thead class="thead-dark">
            <tr>
              <th class="align-middle" scope="col">#</th>
              <th class="align-middle" data-cy="firebaseUid-col-header" scope="col" v-if="options.email">
                {{ "email" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.firebaseUid">
                {{ "firebase_uid" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.name">
                {{ "name" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.nickname">
                {{ "nickname" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.point">
                {{ "point" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.phoneNo">
                {{ "phone_no" | t }}
              </th>
              <th class="align-middle" data-cy="gender-col-header" scope="col" v-if="options.gender">
                {{ "gender" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.birthdate">
                {{ "birthdate" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.countryCode">
                {{ "country_code" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.province">
                {{ "province" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.city">
                {{ "city" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.address">
                {{ "address" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.zipcode">
                {{ "zipcode" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.createdAt">
                {{ "created_at" | t }}
              </th>
              <th class="align-middle" scope="col" v-if="options.updatedAt">
                {{ "updated_at" | t }}
              </th>
              <th class="align-middle" scope="col">{{ "edit" | t }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user of users" :key="user.idx">
              <th scope="row">{{ user.idx }}</th>
              <td v-if="options.email">{{ user.email }}</td>
              <td v-if="options.firebaseUid">{{ user.firebaseUid }}</td>
              <td v-if="options.name">{{ user.name }}</td>
              <td v-if="options.nickname">{{ user.nickname }}</td>
              <td v-if="options.point">{{ user.point }}</td>
              <td v-if="options.phoneNo">{{ user.phoneNo }}</td>
              <td v-if="options.gender">{{ user.gender }}</td>
              <td v-if="options.birthdate">{{ user.birthdate }}</td>
              <td v-if="options.countryCode">{{ user.countryCode }}</td>
              <td v-if="options.province">{{ user.province }}</td>
              <td v-if="options.city">{{ user.city }}</td>
              <td v-if="options.address">{{ user.address }}</td>
              <td v-if="options.zipcode">{{ user.zipcode }}</td>
              <td v-if="options.createdAt">{{ user.createdAtShortDate }}</td>
              <td v-if="options.updatedAt">{{ user.updatedAtShortDate }}</td>
              <td>
                <router-link
                  data-cy="user-info-edit-button"
                  class="btn btn-sm btn-outline-primary"
                  :to="editLink(user)"
                >
                  {{ "edit" | t }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
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

  options = {
    email: true,
    firebaseUid: false,
    name: true,
    nickname: true,
    point: true,
    phoneNo: true,
    gender: false,
    birthdate: false,
    countryCode: false,
    province: false,
    city: false,
    address: false,
    zipcode: false,
    createdAt: false,
    updatedAt: false,
  };

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
  }
}
</script>
