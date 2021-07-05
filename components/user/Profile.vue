<template>
  <section class="box" v-if="user.loggedIn">
    <div class="d-flex justify-content-center">
      <b-avatar :src="user.photuUrl" size="8rem"></b-avatar>
    </div>
    <form @submit.prevent="onSubmit($event)">
      <div role="group">
        <label for="point">{{ "point" | t }}</label>
        <b-form-input disabled id="point" v-model="user.point" :placeholder="'point' | t"></b-form-input>
      </div>
      <div role="group">
        <label for="email">{{ "email" | t }}</label>
        <b-form-input disabled id="email" v-model="user.email" :placeholder="'email' | t"></b-form-input>
      </div>
      <div role="group">
        <label for="displayName">{{ "display_name" | t }}</label>
        <b-form-input
          disabled
          id="displayName"
          v-model="user.displayName"
          :placeholder="'display_name' | t"
        ></b-form-input>
      </div>
      <div role="group">
        <label for="name">{{ "name" | t }}</label>
        <b-form-input id="name" v-model="user.name" :placeholder="'name' | t"></b-form-input>
      </div>
      <div role="group">
        <label for="nickname">{{ "nickname" | t }}</label>
        <b-form-input id="nickname" v-model="user.nickname" :placeholder="'nickname' | t"></b-form-input>
      </div>
      <div role="group">
        <label for="phoneNo">{{ "phone_number" | t }}</label>
        <b-form-input id="phoneNo" v-model="user.phoneNo" :placeholder="'phone_number' | t"></b-form-input>
      </div>
      <div role="group">
        <label for="gender">{{ "gender" | t }}</label>
        <select class="custom-select" id="gender" name="gender" v-model="user.gender">
          <option value="">{{ "select_gender" | t }}</option>
          <option value="M">{{ "male" | t }}</option>
          <option value="F">{{ "female" | t }}</option>
        </select>
      </div>
      <div role="group">
        <label for="birthdate">{{ "birthdate" | t }}</label>
        <b-form-input placeholder="YYMMDD" id="birthdate" v-model="user.birthdate"></b-form-input>
      </div>
      <div role="group">
        <label for="countryCode">{{ "country_code" | t }}</label>
        <b-form-input :placeholder="'country_code' | t" id="countryCode" v-model="user.countryCode"></b-form-input>
      </div>

      <div role="group">
        <label for="province">{{ "province" | t }}</label>
        <b-form-input :placeholder="'province' | t" id="province" v-model="user.province"></b-form-input>
      </div>

      <div role="group">
        <label for="city">{{ "city" | t }}</label>
        <b-form-input :placeholder="'city' | t" id="city" v-model="user.city"></b-form-input>
      </div>

      <div role="group">
        <label for="address">{{ "address" | t }}</label>
        <b-form-input :placeholder="'address' | t" id="address" v-model="user.address"></b-form-input>
      </div>

      <div role="group">
        <label for="zipcode">{{ "zipcode" | t }}</label>
        <b-form-input :placeholder="'zipcode' | t" id="zipcode" v-model="user.zipcode"></b-form-input>
      </div>

      <div class="mt-2 mb-3">
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
import { RequestData, UserModel } from "@/x-vue/interfaces/interfaces";

@Component({
  components: {
    LoginFirst,
  },
})
export default class Profile extends Vue {
  user: UserModel = {} as UserModel;

  async mounted(): Promise<void> {
    try {
      this.user = await ApiService.instance.userProfile();
    } catch (e) {
      this.$emit("error", e);
    }
  }

  onSubmit($event: Event): void {
    let form: RequestData = {
      idx: this.user.idx,
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
    };

    this.$emit("submit", $event, form);
  }
}
</script>
