<template>
  <section>
    <h1>{{ "cafe_management" | t }}</h1>
    <p>{{ "cafe_management_page_description" | t }}</p>

    <div class="alert alert-danger" v-if="categoryError">
      {{ "missing_cafe_categories" | t }}
      <br />
      <b-btn @click="createCategories">{{ "do_you_want_to_create" | t }}</b-btn>
    </div>

    <div class="alert alert-secondary">
      <h5>{{ "cafe_category_list" | t }}</h5>
      <div v-for="(category, id) in categories" :key="id">
        <div class="text-danger" v-if="typeof category === 'string'">
          <b>{{ id }}</b> does not exists
        </div>
        <div v-else>{{ id }}</div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { CafeSettings, CategoryGetsResponse } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class extends Vue {
  cafeSettings = {} as CafeSettings;
  categories: CategoryGetsResponse = {};
  get menus(): string[] {
    return this.cafeSettings.mainMenus;
  }

  get categoryError(): boolean {
    return Object.keys(this.categories).findIndex((id) => typeof this.categories[id] === "string") > -1;
  }

  async createCategories(): Promise<void> {
    const arr = Object.keys(this.categories).filter((id) => typeof this.categories[id] === "string");
    for (const id of arr) {
      try {
        this.categories[id] = await ApiService.instance.categoryCreate({ id: id });
      } catch (e) {
        ComponentService.instance.error(e);
      }
    }
  }

  async mounted(): Promise<void> {
    try {
      this.cafeSettings = await ApiService.instance.loadCafeSettings();
      this.categories = await ApiService.instance.categoryGets(this.menus.join(","));
      console.log("categories; ", this.categories);
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
