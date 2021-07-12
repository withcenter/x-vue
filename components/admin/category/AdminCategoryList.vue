<template>
  <section>
    <div class="d-flex justify-content-between mb-2">
      <h4>{{ "category_list" | t }}</h4>
      <div class="btn btn-sm btn-info" @click="checkDefaultCategory">Check Default Category</div>
    </div>

    <section class="w-100">
      <admin-category-create></admin-category-create>
    </section>

    <section class="overflow-auto mb-3">
      <b-table
        small
        striped
        hover
        :items="categories"
        :fields="visibleFields"
        :busy="loading"
        :bordered="true"
        responsive="true"
        head-variant="dark"
      >
        <template #head()="scope">
          <div class="text-nowrap">{{ scope.label | t }}</div>
        </template>

        <template #cell(idx)="row">
          <router-link :to="'/forum/' + row.item.idx">
            {{ row.item.idx }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg>
          </router-link>
        </template>

        <template #cell(id)="row">
          <router-link :to="'/admin/category/edit/' + row.item.idx">
            {{ row.item.id }} <BoxArrowUpRightSvg></BoxArrowUpRightSvg>
          </router-link>
        </template>

        <template #cell(action)="row">
          <div class="d-flex justify-content-around">
            <router-link :to="'/admin/category/edit/' + row.item.idx">
              <PencilSvg class="trash-icon pointer"></PencilSvg>
            </router-link>
            <div @click="onClickDelete(row.item)">
              <TrashSvg class="trash-icon pointer"></TrashSvg>
            </div>
          </div>
        </template>

        <template #table-busy>
          <Loading variant="primary"></Loading>
        </template>
      </b-table>
    </section>

    <div class="overflow-auto">
      <b-pagination-nav
        :link-gen="linkGen"
        :number-of-pages="noOfPages"
        v-model="currentPage"
        v-on:change="onPageChanged"
        use-router
      ></b-pagination-nav>
    </div>
  </section>
</template>

<style scoped>
.trash-icon {
  width: 1em;
}
</style>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { CategoryModel } from "@/x-vue/interfaces/interfaces";
import AdminCategoryCreate from "@/x-vue/components/admin/category/AdminCategoryCreate.vue";
import Vue from "vue";
import Component from "vue-class-component";
import Service from "../../../services/component.service";
import ComponentService from "../../../services/component.service";
import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";

import TrashSvg from "@/x-vue/svg/TrashSvg.vue";
import PencilSvg from "@/x-vue/svg/PencilSvg.vue";

import Loading from "@/x-vue/widgets/common/Loading.vue";
@Component({
  components: {
    AdminCategoryCreate,
    Loading,
    BoxArrowUpRightSvg,
    TrashSvg,
    PencilSvg,
  },
})
export default class AdminCategoryList extends Vue {
  categories: Array<CategoryModel> = [];
  s = Service.instance;

  limit = 50;
  noOfPages = 10;
  currentPage = "1";
  total = 0;

  fields: Array<{ [index: string]: unknown }> = [
    { key: "idx", visible: true },
    { key: "id", visible: true },
    { key: "title", visible: true },
    { key: "description", visible: true },
    { key: "action", visible: true, class: "text-center" },
  ];

  get visibleFields(): Array<{ [index: string]: unknown }> {
    return this.fields.filter((field) => field.visible);
  }

  loading = false;

  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    this.currentPage = "" + page;
    this.onSubmitSearch();
  }

  mounted(): void {
    this.onSubmitSearch();
  }

  async onSubmitSearch(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    try {
      this.categories = await ApiService.instance.categorySearch({
        limit: this.limit,
        page: this.currentPage,
      });
      this.total = await ApiService.instance.categoryCount({});
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      this.s.error(e);
    }
    this.loading = false;
  }

  async onClickDelete(category: CategoryModel): Promise<void> {
    const re = await ComponentService.instance.confirm("Delete Category", "Do you want to delete the category?");
    if (!re) return;
    try {
      const cat = await ApiService.instance.categoryDelete({
        idx: category.idx,
      });

      const index = this.categories.findIndex((c) => {
        return c.idx == cat.idx;
      });

      if (index != -1) {
        this.categories.splice(index, 1);
      }
    } catch (e) {
      this.s.error(e);
    }
  }

  async checkDefaultCategory(): Promise<void> {
    try {
      const menus = await ApiService.instance.cafeInitDefautMenu();
      let ok = 0;
      let error = 0;
      for (const menu in menus) {
        if (menu) ok++;
        else error++;
      }
      this.s.alert("Default Menus: ", `${ok} Okay Menus. ${error} Error Menus`);
      this.onSubmitSearch();
    } catch (e) {
      this.s.error(e);
    }
  }
}
</script>
