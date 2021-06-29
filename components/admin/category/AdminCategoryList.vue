<template>
  <section>
    <div class="d-flex justify-content-between mb-2">
      <h4>{{ "category_list" | t }}</h4>
      <div class="btn btn-sm btn-info" @click="checkDefaultCategory">
        Check Default Category
      </div>
    </div>

    <div class="container">
      <div class="row">
        <section class="w-100">
          <admin-category-create></admin-category-create>
        </section>

        <table class="table table-striped mt-2">
          <thead class="thead-dark">
            <tr class="fs-sm">
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">{{ "title" | t }}</th>
              <th scope="col">{{ "description" | t }}</th>
              <th scope="col">{{ "action" | t }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category of categories" :key="category.idx">
              <th scope="row">
                <router-link :to="'/forum/' + category.id">{{
                  category.idx
                }}</router-link>
              </th>
              <td>
                <router-link :to="'/admin/category/edit/' + category.id"
                  >{{ category.id }}
                </router-link>
              </td>
              <td>
                <span>{{ category.title }}</span>
              </td>
              <td>
                <span>
                  {{ category.description }}
                </span>
              </td>
              <td class="justify-content-center">
                <div
                  class="btn btn-sm btn-outline-danger"
                  @click="onClickDelete(category)"
                >
                  ❌
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="overflow-auto">
          <b-pagination-nav
            :link-gen="linkGen"
            :number-of-pages="noOfPages"
            v-model="currentPage"
            v-on:change="onPageChanged"
            use-router
          ></b-pagination-nav>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { CategoryModel } from "@/x-vue/services/interfaces";
import AdminCategoryCreate from "@/x-vue/components/admin/category/AdminCategoryCreate.vue";
import Vue from "vue";
import Component from "vue-class-component";
import AdminService from "../admin.service";

@Component({
  components: {
    AdminCategoryCreate,
  },
})
export default class AdminCategoryList extends Vue {
  categories: Array<CategoryModel> = [];
  as = AdminService.instance;

  limit = 5;
  noOfPages = 10;
  currentPage = "1";
  total = 0;

  linkGen(pageNum: number): string {
    return pageNum === 1 ? "?" : `?page=${pageNum}`;
  }

  onPageChanged(page: number): void {
    // console.log("page; ", page);
    this.currentPage = "" + page;
    this.onSubmitSearch();
  }

  mounted(): void {
    this.onSubmitSearch();
  }

  async onSubmitSearch(): Promise<void> {
    try {
      this.categories = await ApiService.instance.categorySearch({
        limit: this.limit,
        page: this.currentPage,
      });
      this.total = await ApiService.instance.categoryCount({});
      this.noOfPages = Math.ceil(this.total / this.limit);
    } catch (e) {
      this.as.error(e);
    }
  }

  async onClickDelete(category: CategoryModel): Promise<void> {
    const re = confirm("Delete the category?");
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
      this.as.error(e);
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
      this.as.alert(
        "Default Menus: " + `${ok} Okay Menus. ${error} Error Menus`
      );
    } catch (e) {
      this.as.error(e);
    }
  }
}
</script>
