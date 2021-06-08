<template>
  <section data-cy="admin-category-list-page">
    <h4>Category list</h4>
    <div class="container">
      <div class="row">
        <section class="w-100">
          <form>
            <input type="hidden" name="p" value="admin.index" />
            <input
              type="hidden"
              name="w"
              value="category/admin-category-list"
            />
            <input type="hidden" name="mode" value="create" />
            <div class="d-flex">
              <input
                class="form-control mb-2"
                type="text"
                name="id"
                placeholder="enter_category_id"
              />
              <button class="btn btn-primary ml-3 mb-2 w-50" type="submit">
                {{ "create" | t }}
              </button>
            </div>
          </form>
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
                <span>{{ category.title }} </span>
              </td>
              <td>
                <span data-cy="category-<?= $category->id ?>-description"
                  >{{ category.description }}
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
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { CategoryModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminCategoryList extends Vue {
  categories: Array<CategoryModel> = [];

  searchKey = "";

  mounted(): void {
    this.onSubmitSearch();
  }

  async onSubmitSearch(): Promise<void> {
    try {
      this.categories = await ApiService.instance.categorySearch({
        searchKey: this.searchKey,
      });
      console.log(this.categories);
    } catch (e) {
      ApiService.instance.error(e);
    }
  }

  async onClickDelete(category: CategoryModel): Promise<void> {
    console.log(category);
    try {
      const categorie = await ApiService.instance.categoryDelete({
        id: category.id,
      });
      console.log(this.categories);
    } catch (e) {
      ApiService.instance.error(e);
    }
  }
}
</script>
