<template>
  <div class="form-group mt-2">
    <label>{{ "adv_banner_type" | t }}</label>
    <select class="form-control" v-model="banner.code" :disabled="banner.isActive">
      <option value="" disabled selected>
        {{ "select_type" | t }}
      </option>
      <option v-for="type in settings.types" :key="type">
        {{ type }}
      </option>
    </select>
    <small class="form-text text-muted">
      {{ "adv_banner_type_hint" | t }}
    </small>
  </div>
</template>
<script lang="ts">
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementSettings } from "@/x-vue/interfaces/interfaces";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() banner!: AdvertisementModel;
  @Prop() settings!: AdvertisementSettings;
}
</script>
