<template>
  <router-link :to="`/advertisement/edit/${advertisement.idx}`">
    <div class="d-flex">
      <div class="overflow-hidden">
        <div>No. {{ advertisement.idx }}</div>
        <div class="text-truncate">
          {{ advertisement.title ? advertisement.title : "No title .." }}
        </div>
        <div>
          <span class="badge badge-success" v-if="advertisement.isActive">
            Active
          </span>
          <span class="badge badge-warning" v-if="advertisement.isInactive">
            Inactive
          </span>
          <span class="badge badge-info" v-if="advertisement.isWaiting">
            Waiting
          </span>
          <span class="badge badge-secondary ml-2">
            {{
              advertisement.subcategory ? advertisement.subcategory : "global"
            }}
          </span>
        </div>
        <div class="text-truncate">
          {{ advertisement.content ? advertisement.content : "No content .." }}
        </div>
      </div>
      <span class="flex-grow-1"></span>
      <div class="p-1" v-for="file of advertisement.files" :key="file.idx">
        <img
          style="height: 90px; width: 90px"
          :src="file.url"
          :alt="file.name"
        />
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { AdvertisementModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["advertisement"],
})
export default class AdvertisementPreview extends Vue {
  advertisement!: AdvertisementModel;
}
</script>
