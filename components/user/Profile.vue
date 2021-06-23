<template>
  <section class="box" v-if="api.loggedIn">
    <div class="d-flex justify-content-center">
      <b-avatar :src="api.user.photuUrl" size="8rem"></b-avatar>
    </div>
    <form @submit.prevent="onSubmit">
      <div role="group">
        <label for="point">{{ "point" | t }}</label>
        <b-form-input
          disabled
          id="point"
          v-model="api.user.point"
          :placeholder="'point' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="email">{{ "email" | t }}</label>
        <b-form-input
          disabled
          id="email"
          v-model="api.user.email"
          :placeholder="'email' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="displayName">{{ "display_name" | t }}</label>
        <b-form-input
          disabled
          id="displayName"
          v-model="api.user.displayName"
          :placeholder="'display_name' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="name">{{ "name" | t }}</label>
        <b-form-input
          id="name"
          v-model="api.user.name"
          :placeholder="'name' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="nickname">{{ "nickname" | t }}</label>
        <b-form-input
          id="nickname"
          v-model="api.user.nickname"
          :placeholder="'nickname' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="phoneNo">{{ "phone_number" | t }}</label>
        <b-form-input
          id="phoneNo"
          v-model="api.user.phoneNo"
          :placeholder="'phone_number' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="gender">{{ "gender" | t }}</label>
        <select class="custom-select" id="gender" name="gender">
          <option value="">{{ "select_gender" | t }}</option>
          <option value="M">{{ "male" | t }}</option>
          <option value="F">{{ "female" | t }}</option>
        </select>
      </div>
      <div role="group">
        <label for="birthdate">{{ "birthdate" | t }}</label>
        <b-form-input
          placeholder="YYMMDD"
          id="birthdate"
          v-model="api.user.birthdate"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="countryCode">{{ "country_code" | t }}</label>
        <b-form-input
          :placeholder="'country_code' | t"
          id="countryCode"
          v-model="api.user.countryCode"
        ></b-form-input>
      </div>

      <div role="group">
        <label for="province">{{ "province" | t }}</label>
        <b-form-input
          :placeholder="'province' | t"
          id="province"
          v-model="api.user.province"
        ></b-form-input>
      </div>

      <div role="group">
        <label for="city">{{ "city" | t }}</label>
        <b-form-input
          :placeholder="'city' | t"
          id="city"
          v-model="api.user.city"
        ></b-form-input>
      </div>

      <div role="group">
        <label for="address">{{ "address" | t }}</label>
        <b-form-input
          :placeholder="'address' | t"
          id="address"
          v-model="api.user.address"
        ></b-form-input>
      </div>

      <div role="group">
        <label for="zipcode">{{ "zipcode" | t }}</label>
        <b-form-input
          :placeholder="'zipcode' | t"
          id="zipcode"
          v-model="api.user.zipcode"
        ></b-form-input>
      </div>

      <div class="mt-2">
        <button type="submit" class="btn btn-primary col-3">
          {{ "save" | t }}
        </button>
      </div>
    </form>
    <login-first></login-first>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LoginFirst from "@/x-vue/components/user/LoginFirst.vue";
import { ApiService } from "@/x-vue/services/api.service";
import { RequestData } from "@/x-vue/services/interfaces";

@Component({
  components: {
    LoginFirst,
  },
})
export default class Profile extends Vue {
  api = ApiService.instance;

  async onSubmit(): Promise<void> {
    let options: RequestData = {
      idx: this.api.user.idx,
      point: this.api.user.point,
      email: this.api.user.email,
      firebaseUid: this.api.user.firebaseUid,
      name: this.api.user.name,
      nickname: this.api.user.nickname,
      phoneNo: this.api.user.phoneNo,
      gender: this.api.user.gender,
      birthdate: this.api.user.birthdate,
      countryCode: this.api.user.countryCode,
      province: this.api.user.province,
      city: this.api.user.city,
      address: this.api.user.address,
      zipcode: this.api.user.zipcode,
    };

    try {
      await this.api.profileUpdate(options);
      this.api.alert("User Update", "Update Success");
    } catch (e) {
      this.api.error(e);
    }
  }
}
</script>
