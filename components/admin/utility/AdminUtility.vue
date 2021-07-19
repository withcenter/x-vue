<template>
  <div>
    <h1>Admin Utiltiy</h1>
    <hr />

    <b-button class="ml-2" variant="danger" @click="onDeleteAllPosts" v-if="progressSamples == false">
      {{
        {
          en: "Delete all data",
          ko: "DB 초기화. 카테고리, 글/코멘트, 사진 삭제.",
        } | t
      }}
    </b-button>
    <b-spinner v-else></b-spinner>

    <b-button class="ml-2" @click="onCreateSamplePosts" v-if="progressSamples == false">
      {{ { en: "Create Sample Posts, comments", ko: "샘플 글/코멘트/사진 생성" } | t }}
    </b-button>
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
      await ApiService.instance.request("utility.createSamplePosts");
      // console.log("res; ", res);
      ComponentService.instance.alert("Database clear", "Database had been cleared.");
    } catch (e) {
      console.error(e);
      ComponentService.instance.error(e);
    }
    this.progressSamples = false;
  }
  async onDeleteAllPosts(): Promise<void> {
    try {
      await ApiService.instance.request("admin.truncateDb");
      ComponentService.instance.alert("All posts deleted", "All posts had been deleted.");
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
