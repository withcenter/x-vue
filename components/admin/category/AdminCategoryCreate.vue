<template>
  <section>
    <form @submit.prevent="onSubmit()">
      <div class="d-flex">
        <input
          class="form-control mb-2"
          type="text"
          v-model="id"
          :placeholder="'enter_category_id' | t"
        />
        <button class="btn btn-primary ml-3 mb-2 w-50" type="submit">
          {{ "create" | t }}
        </button>
      </div>
    </form>
  </section>
</template>
<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { CategoryModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import AdminService from "../admin.service";

@Component({})
export default class AdminCategoryCreate extends Vue {
  as = AdminService.instance;
  category: CategoryModel = {} as CategoryModel;
  api = ApiService.instance;

  id = "";
  title = "";
  description = "";

  async onSubmit(): Promise<void> {
    console.log("categoryUpdate:: create");
    try {
      this;

      this.category = await ApiService.instance.categoryCreate({
        id: this.id,
      });
      console.log(this.category);
      this.as.open(`/admin/category/edit/${this.category.id}`);
    } catch (e) {
      if (e == "error_category_exists") {
        this.as.open(`/admin/category/edit/${this.id}`);
      } else {
        this.as.error(e);
      }
    }
  }
}
</script>
