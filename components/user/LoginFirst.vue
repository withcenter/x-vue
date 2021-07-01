<template>
  <div
    class="p-2 text-center rounded bg-secondary"
    v-if="api._user.notLoggedIn"
  >
    <h3>Login First</h3>
  </div>
</template>

<script lang="ts">
import { ApiService } from "../../services/api.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class LoginFirst extends Vue {
  api = ApiService.instance;
}
</script>
