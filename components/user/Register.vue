<template>
  <div data-cy="register-form">
    <h1>User Register</h1>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        {{ "email" | t }}
        <input type="text" name="email" v-model="form.email" />
      </div>
      <div class="form-group">
        {{ "password" | t }}
        <input type="password" name="password" v-model="form.password" />
      </div>
      <div class="form-group">
        {{ "name" | t }}
        <input type="text" name="name" v-model="form.name" />
      </div>
      <button type="submit" class="btn btn-primary">{{ "submit" | t }}</button>
    </form>
  </div>
</template>

<script lang="ts">
import { XFunctions } from "@/x-vue-helper/functions";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Login extends Vue {
  api = ApiService.instance;
  form = {};

  async onSubmit(): Promise<void> {
    // console.log('Register::form', this.form);
    try {
      await this.api.register(this.form);
      this.$store.commit("register");
      XFunctions.open("/");
    } catch (e) {
      XFunctions.error(e);
    }
  }
}
</script>
