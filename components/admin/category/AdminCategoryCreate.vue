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
import { XFunctions } from "@/x-vue-helper/functions";
import { ApiService } from "@/x-vue/services/api.service";
import { CategoryModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminCategoryCreate extends Vue {
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
      XFunctions.open({ path: `/admin/category/edit/${this.category.id}` });
    } catch (e) {
      if (e == "error_category_exists") {
        XFunctions.open({ path: `/admin/category/edit/${this.id}` });
      } else {
        XFunctions.error(e);
      }
    }
  }
}
</script>
