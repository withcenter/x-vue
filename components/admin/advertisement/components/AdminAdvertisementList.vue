<template>
  <div class="admin-advertisement-list">
    <div v-if="!loading">
      <div class="mt-3" v-if="advertisements.length">
        <div
          class="box d-flex p-2 mb-2"
          v-for="advertisement of advertisements"
          :key="advertisement.idx"
        >
          <advertisement-preview
            class="w-100"
            :advertisement="advertisement"
          ></advertisement-preview>
          <div class="ml-1 px-2 text-center border-left">
            <b-avatar
              tabindex="0"
              class="center"
              :src="advertisement.user.src"
              :size="'4em'"
            ></b-avatar>
            <div class="w-100 text-truncate">
              {{ advertisement.user.displayName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Loading Advertisements ...
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Service from "@/x-vue/services/x-vue.service";
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementModel } from "@/x-vue/services/interfaces";
import AdvertisementPreview from "@/x-vue/components/advertisement/AdvertisementPreview.vue";

@Component({
  components: {
    AdvertisementPreview,
  },
})
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
