<template>
  <div>
    <h1>{{ "user_login" | t }}</h1>
    <form @submit.prevent="$emit('submit', $event, form)">
      <b-form-group :label="'email' | t" label-for="email">
        <b-form-input
          id="email"
          v-model="form.email"
          type="email"
          :placeholder="'enter_email' | t"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group :label="'password' | t" label-for="password">
        <b-form-input
          id="password"
          v-model="form.password"
          type="password"
          :placeholder="'enter_password' | t"
          required
        ></b-form-input>
      </b-form-group>
      <button type="submit" class="btn btn-primary px-5">
        {{ "submit" | t }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Login extends Vue {
  form = {};
}
</script>
