<template>
  <div>
    <h1>Admin User Edit</h1>
    <section id="admin-user-edit">
      <form @submit.prevent="onSubmit()" class="text-capitalize">
        <div class="form-row">
          <div class="form-group col-6">
            <label for="idx">IDX</label>
            <input
              type="text"
              class="form-control"
              placeholder="IDX"
              name="idx"
              id="idx"
              v-model="user.idx"
              disabled
            />
          </div>

          <div class="form-group col-6">
            <label for="point">{{ "point" | t }}</label>
            <input
              type="text"
              class="form-control"
              placeholder="point"
              name="point"
              id="point"
              v-model="user.point"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-6">
            <label for="email">{{ "email" | t }}</label>
            <input
              type="text"
              class="form-control"
              placeholder="email"
              name="email"
              id="email"
              v-model="user.email"
            />
          </div>
          <div class="form-group col-6">
            <label for="firebaseUid">firebaseUid</label>
            <input
              type="text"
              class="form-control"
              placeholder="firebaseUid"
              name="firebaseUid"
              id="firebaseUid"
              v-model="user.firebaseUid"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-6">
            <label for="name">{{ "name" | t }}</label>
            <input
              type="text"
              class="form-control"
              placeholder="name"
              name="name"
              id="name"
              v-model="user.name"
            />
          </div>

          <div class="form-group col-6">
            <label for="nickname">{{ "nickname" | t }}</label>
            <input
              type="text"
              class="form-control"
              placeholder="nickname"
              name="nickname"
              id="nickname"
              v-model="user.nickname"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-6">
            <label for="phoneNo">{{ "phone_no" | t }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="'phone_no' | t"
              name="phoneNo"
              id="phoneNo"
              v-model="user.phoneNo"
            />
          </div>

          <div class="form-group col-6">
            <label for="gender">{{ "gender" | t }}</label>
            <select class="custom-select" id="gender" name="gender">
              <option value="">{{ "select_gender" | t }}</option>
              <option value="M">{{ "male" | t }}</option>
              <option value="F">{{ "female" | t }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-6">
            <label for="birthdate">{{ "birthdate" | t }}</label>
            <input
              type="text"
              class="form-control"
              placeholder="YYMMDD"
              name="birthdate"
              id="birthdate"
              v-model="user.birthdate"
            />
          </div>

          <div class="form-group col-6">
            <label for="countryCode">{{ "country_code" | t }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="'country_code' | t"
              name="countryCode"
              id="countryCode"
              maxlength="2"
              v-model="user.countryCode"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-6">
            <label for="province">{{ "province" | t }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="'province' | t"
              name="province"
              id="province"
              v-model="user.province"
            />
          </div>

          <div class="form-group col-6">
            <label for="city">{{ "city" | t }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="'city' | t"
              name="city"
              id="city"
              v-model="user.city"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-6">
            <label for="address">{{ "address" | t }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="'address' | t"
              name="address"
              id="address"
              v-model="user.address"
            />
          </div>

          <div class="form-group col-6">
            <label for="zipcode">{{ "zipcode" | t }}</label>
            <input
              type="text"
              class="form-control"
              :placeholder="'zipcode' | t"
              name="zipcode"
              id="zipcode"
              v-model="user.zipcode"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-6">
            <label for="block">{{ "block" | t }}</label>
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                id="block"
                name="block"
                v-model="user.block"
              />
              <label class="custom-control-label" for="block">{{
                "block_user_for_posting" | t
              }}</label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-start mt-2 mb-3">
          <div class="mr-5">
            <button type="submit" class="btn btn-primary">
              {{ "save" | t }}
            </button>
          </div>
          <div>
            <router-link
              class="btn btn-outline-secondary"
              :to="
                '/admin/user' +
                ($route.query.page ? `?page=${$route.query.page}` : '')
              "
            >
              {{ "cancel" | t }}
            </router-link>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { RequestData, UserModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import AdminService from "../admin.service";
@Component({
  components: {},
})
export default class AdminUserEdit extends Vue {
  user: UserModel = {} as UserModel;
  api: ApiService = ApiService.instance;
  as = AdminService.instance;

  async mounted(): Promise<void> {
    try {
      this.user = await this.api.userGet({
        idx: this.$route.params.userIdx ?? 0,
        full: true,
      });
    } catch (e) {
      this.as.error(e);
    }
  }

  async onSubmit(): Promise<void> {
    let options: RequestData = {
      idx: this.user.idx,
      point: this.user.point,
      email: this.user.email,
      firebaseUid: this.user.firebaseUid,
      name: this.user.name,
      nickname: this.user.nickname,
      phoneNo: this.user.phoneNo,
      gender: this.user.gender,
      birthdate: this.user.birthdate,
      countryCode: this.user.countryCode,
      province: this.user.province,
      city: this.user.city,
      address: this.user.address,
      zipcode: this.user.zipcode,
      block: this.user.block ? "Y" : "N",
      // domain: this.user.domian,
    };

    try {
      this.user = await this.api.userUpdate(options);
      this.as.alert("User Update : " + "Update Success");
    } catch (e) {
      this.as.error(e);
    }
  }
}
</script>
