<template>
  <div>
    <h4>Admin Settings</h4>

    <div class="mt-2 alert alert-info">
      api endpoint: {{ api.endpoint }} <br />
      cookie domain: {{ api.cookieDomain }}<br />
      session id: {{ api.user.sessionId }}<br />
    </div>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Admin email addresses</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <small id="emailHelp" class="form-text text-muted">
          Input multip admin email addresses separating by comma(,).
        </small>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { ApiService } from "@/x-vue/services/api.service";
@Component({})
export default class AdminSettings extends Vue {
  api = ApiService.instance;
  form = {};
}
</script>
