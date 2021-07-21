<template>
  <div class="register-form">
    <h1>{{ "user_register" | t }}</h1>
    <form @submit.prevent="$emit('submit', $event, form)">
      <b-form-group class="mb-2" :label="'email' | t" label-for="email">
        <b-form-input v-model="form.email" type="email" :placeholder="'enter_email' | t" required></b-form-input>
      </b-form-group>
      <b-form-group class="mb-2" :label="'password' | t" label-for="password">
        <b-form-input
          v-model="form.password"
          type="password"
          :placeholder="'enter_password' | t"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group class="mb-2" :label="'name' | t" label-for="name">
        <b-form-input v-model="form.name" type="text" :placeholder="'enter_name' | t" required></b-form-input>
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
