<template>
  <section class="form-group mt-2">
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
    <div class="alert alert-info">
      <div>Banner image must be JPG only.</div>
      <div v-if="banner.code == 'top'">width: 570px, height: 200px.</div>
      <div v-if="banner.code == 'sidebar'">width: 570px, height: 200px.</div>
      <div v-if="banner.code == 'square'">width: 360px, height: 360px.</div>
      <div v-if="banner.code == 'line'">width: 360px, height: 360px.</div>
    </div>
  </section>
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
