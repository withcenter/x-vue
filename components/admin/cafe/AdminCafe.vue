<template>
  <section>
    <h1>{{ "cafe_management" | t }}</h1>
    <div class="alert alert-warning">
      {{
        {
          en: "This menu is only for sonub.com. Remove this menu on other projects.",
          ko: "이 메뉴는 소너브(카페) 전용 메뉴로 다른 프로젝트를 할 때에는 이 메뉴를 빼면 된다.",
        } | t
      }}
    </div>

    <div class="alert alert-danger" v-if="categoryError">
      {{ "missing_cafe_categories" | t }}
      <br />
      <b-btn @click="createCategories">{{ "do_you_want_to_create" | t }}</b-btn>
    </div>

    <div v-if="terms">{{ { en: "There is user agreement", ko: "회원 가입 약관이 있습니다." } | t }}</div>
    <div class="text-danger" v-else>
      {{ { en: "There is no user agreement", ko: "회원 가입 약관이 없습니다." } | t }}
    </div>
    <div v-if="terms">{{ { en: "There is provacy policy.", ko: "회원 정보 보호 정책이 있습니다." } | t }}</div>
    <div class="text-danger" v-else>
      {{ { en: "There is no provacy policy.", ko: "회원 정보 보호 정책이 없습니다." } | t }}
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
import { CafeSettings, CategoryGetsResponse, Settings } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class extends Vue {
  settings = {} as Settings;
  cafeSettings = {} as CafeSettings;
  categories: CategoryGetsResponse = {};

  get terms(): string {
    return this.settings.termsAndConditions;
  }
  get privacy(): string {
    return this.settings.privacyPolicy;
  }

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
      this.settings = await ApiService.instance.settings();
      this.cafeSettings = await ApiService.instance.loadCafeSettings();
      this.categories = await ApiService.instance.categoryGets(this.menus.join(","));
      console.log("categories; ", this.categories);
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
