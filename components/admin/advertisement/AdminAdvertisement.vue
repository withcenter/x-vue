<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Advertisement Settings" active>
        <AdminAdvertisementSettings></AdminAdvertisementSettings>
      </b-tab>
      <b-tab title="Advertisement List">
        <AdminAdvertisementList></AdminAdvertisementList>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AdminAdvertisementSettings from "./components/AdminAdvertisementSettings.vue";
import AdminAdvertisementList from "./components/AdminAdvertisementList.vue";

@Component({
  components: {
    AdminAdvertisementSettings,
    AdminAdvertisementList,
  },
})
export default class AdminAdvertisement extends Vue {}
</script>
