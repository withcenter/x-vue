<template>
  <div>
    <h1>Admin Utiltiy</h1>
    <hr />
    <b-button @click="onCreateSamplePosts" v-if="progressSamples == false">Create Sample Posts, comments</b-button>
    <b-spinner v-else></b-spinner>
  </div>
</template>
<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";
@Component({})
export default class extends Vue {
  progressSamples = false;
  async onCreateSamplePosts(): Promise<void> {
    this.progressSamples = true;
    try {
      const res = await ApiService.instance.request("utility.createSamplePosts");
      console.log("res; ", res);
      ComponentService.instance.alert("Sample posts", "Sample posts had been created.");
    } catch (e) {
      console.error(e);
      ComponentService.instance.error(e);
    }
    this.progressSamples = false;
  }
}
</script>
