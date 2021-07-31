<template>
  <div class="pb-3">
    <h1>{{ "admin_dashboard" | t }}</h1>
    <div>
      <router-link class="btn btn-link" to="/admin/user">{{ "user" | t }}</router-link>
      <router-link class="btn btn-link" to="/admin/category">
        {{ "category" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/post">
        {{ "post" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/file">
        {{ "file" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/user-activity">
        {{ "user_activity" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/messaging">
        {{ "messaging" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/setting">
        {{ "setting" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/translation">
        {{ "translation" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/advertisement">
        {{ "advertisement" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/utility">
        {{ "utility" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/cafe">
        {{ "cafe_admin" | t }}
      </router-link>
      <router-link class="btn btn-link" to="/admin/samples">
        {{ "samples" | t }}
      </router-link>
    </div>
    <hr />
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
