<template>
  <div class="admin-advertisement-list">
    <div v-if="!loading">
      <div
        class="box"
        v-for="advertisement of advertisements"
        :key="advertisement.idx"
      >
        {{ advertisement }}
      </div>
    </div>
    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Loading Advertisements ...
    </div>
  </div>
</template>
<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementModel } from "@/x-vue/services/interfaces";
import Service from "@/x-vue/services/x-vue.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminAdvertisementList extends Vue {
  api = ApiService.instance;

  loading = false;
  advertisements: AdvertisementModel[] = [];

  mounted(): void {
    this.loadAdvertisements();
  }

  async loadAdvertisements(): Promise<void> {
    this.loading = true;
    try {
      this.advertisements = await this.api.advertisementSearch({});
      // console.log(this.posts);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      Service.instance.error(e);
    }
  }
}
</script>
