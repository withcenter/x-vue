<template>
  <div>
    <h2>Advertisement</h2>

    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="Advertisement Settings" active>
          <AdminAdvertisementSettings></AdminAdvertisementSettings>
        </b-tab>
        <b-tab title="Advertisement List"
          ><p>@todo display advertisements of all user</p></b-tab
        >
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AdminAdvertisementSettings from "./components/AdminAdvertisementSettings.vue";

@Component({
  components: {
    AdminAdvertisementSettings,
  },
})
export default class AdminAdvertisement extends Vue {}
</script>
