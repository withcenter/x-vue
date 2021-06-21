<template>
  <div>
    <h1>{{ "admin_dashboard" | t }}</h1>

    <div>
      <router-link class="btn btn-link" to="/admin/user">User</router-link>
      <router-link class="btn btn-link" to="/admin/category"
        >Category</router-link
      >
      <router-link class="btn btn-link" to="/admin/post">Post</router-link>
      <router-link class="btn btn-link" to="/admin/file">File</router-link>
      <router-link class="btn btn-link" to="/admin/messaging"
        >Messaging</router-link
      >
      <router-link class="btn btn-link" to="/admin/setting"
        >Settings</router-link
      >
    </div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component({
  components: {},
})
export default class Admin extends Vue {}
</script>
