<template>
  <section>
    <h1>{{ "category_edit" | t }}</h1>
    <form @submit.prevent="onSubmit()">
      <table class="table">
        <thead class="fs-sm">
          <tr class="thead-light">
            <th scope="col">{{ "option" | t }}</th>
            <th scope="col">{{ "setting" | t }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ "category_id" | t }}</td>
            <td>{{ category.id }}</td>
          </tr>

          <tr>
            <td>{{ "title" | t }}</td>
            <td>
              <input
                class="form-control"
                type="text"
                v-model="category.title"
              />
            </td>
          </tr>
          <tr>
            <td>{{ "description" | t }}</td>
            <td>
              <input
                class="form-control"
                type="text"
                v-model="category.description"
              />
            </td>
          </tr>

          <tr>
            <td>{{ "domain" | t }}</td>
            <td>
              <input
                class="form-control"
                type="text"
                v-model="category.domain"
              />
            </td>
          </tr>

          <tr class="table-dark fs-sm">
            <td colspan="2">{{ "subcategories" | t }}</td>
          </tr>
          <tr class="table-light">
            <td colspan="2">
              <div class="hint">
                {{ "subcategories_hint" | t }}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <textarea
                class="w-100 form-control"
                rows="3"
                name="subcategories"
                v-model="category.subcategories"
              ></textarea>
            </td>
          </tr>

          <tr class="table-dark">
            <td colspan="2">{{ "point_settings" | t }}</td>
          </tr>
          <tr class="table-light">
            <td colspan="2">
              <div class="hint">
                {{ "point_settings_hint" | t }}
              </div>
            </td>
          </tr>

          <tr>
            <td>{{ "post_create_point" | t }}</td>
            <td>
              <input
                class="form-control"
                type="number"
                v-model="category.createPost"
              />
            </td>
          </tr>
          <tr>
            <td>{{ "post_delete_point" | t }}</td>
            <td>
              <input
                class="form-control"
                type="number"
                v-model="category.deletePost"
              />
            </td>
          </tr>

          <tr>
            <td>{{ "comment_create_point" | t }}</td>
            <td>
              <input
                class="form-control"
                type="number"
                v-model="category.createComment"
              />
            </td>
          </tr>
          <tr>
            <td>{{ "comment_delete_point" | t }}</td>
            <td>
              <input
                class="form-control"
                type="number"
                v-model="category.deleteComment"
              />
            </td>
          </tr>

          <tr class="table-dark">
            <td colspan="2">{{ "limit_by_hour_day" | t }}</td>
          </tr>
          <tr class="table-light">
            <td colspan="2">
              <div class="hint">
                {{ "limit_by_hour_day_hint" | t }}
              </div>
            </td>
          </tr>

          <tr>
            <td>{{ "hour_count_limit" | t }}</td>
            <td class="d-flex align-items-center">
              <input
                class="w-25 form-control"
                type="number"
                v-model="category.createHourLimit"
              />
              <span class="mx-2">/</span>
              <input
                class="w-25 form-control"
                type="number"
                v-model="category.createHourLimitCount"
              />
            </td>
          </tr>
          <tr>
            <td>{{ "day_count_limit" | t }}</td>
            <td>
              <input
                class="w-25 form-control"
                type="number"
                v-model="category.createDailyLimitCount"
              />
            </td>
          </tr>

          <tr>
            <td>{{ "ban_on_writing" | t }}</td>
            <td>
              <label>
                <input
                  type="radio"
                  value="Y"
                  v-model="category.banCreateOnLimit"
                />
                {{ "yes" | t }},
              </label>
              &nbsp;
              <label>
                <input
                  type="radio"
                  value="N"
                  v-model="category.banCreateOnLimit"
                />
                {{ "no" | t }}
              </label>
            </td>
          </tr>

          <tr class="table-dark">
            <td colspan="2">{{ "limit_by_point_possession" | t }}</td>
          </tr>
          <tr class="table-light">
            <td colspan="2">
              <div class="hint">
                {{ "limit_by_point_possession_hint" | t }}
              </div>
            </td>
          </tr>

          <tr>
            <td>{{ "post_create_limit" | t }}</td>
            <td>
              <input class="form-control" v-model="category.postCreateLimit" />
            </td>
          </tr>

          <tr>
            <td>{{ "comment_create_limit" | t }}</td>
            <td>
              <input
                class="form-control"
                v-model="category.commentCreateLimit"
              />
            </td>
          </tr>

          <tr>
            <td>{{ "post_comment_read_limit" | t }}</td>
            <td>
              <input class="form-control" v-model="category.readLimit" />
            </td>
          </tr>

          <tr class="table-dark">
            <td colspan="2">{{ "return_to" | t }}</td>
          </tr>

          <tr>
            <td>{{ "return_to_after_edit" | t }}</td>
            <td>
              <label>
                <input
                  type="radio"
                  v-model="category.returnToAfterPostEdit"
                  value="V"
                />
                {{ "Post view page" | t }}
              </label>
              &nbsp;
              <label>
                <input
                  type="radio"
                  v-model="category.returnToAfterPostEdit"
                  value="L"
                />
                {{ "Post list page" | t }}
              </label>
            </td>
          </tr>

          <tr class="table-dark">
            <td colspan="2">{{ "widgets_web" | t }}</td>
          </tr>

          <tr>
            <td>{{ "Post Edit Widget" | t }}</td>
            <td>
              <input class="form-control" v-model="category.postEditWidget" />
            </td>
          </tr>

          <tr class="table-light">
            <td colspan="2">
              <div class="hint">
                {{ "Input post edit widget options" | t }}
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="2">
              <textarea
                class="w-100"
                rows="5"
                v-model="category.postEditWidgetOption"
              ></textarea>
            </td>
          </tr>
          <tr>
            <td>{{ "Post View Widget" | t }}</td>
            <td>
              <input class="form-control" v-model="category.postViewWidget" />
            </td>
          </tr>

          <tr>
            <td>{{ "Forum List Header" | t }}</td>
            <td>
              <input
                class="form-control"
                v-model="category.postListHeaderWidget"
              />
            </td>
          </tr>

          <tr>
            <td>{{ "Forum List Widget" | t }}</td>
            <td>
              <input class="form-control" v-model="category.postListWidget" />
            </td>
          </tr>

          <tr>
            <td>{{ "Forum List Pagination Widget" | t }}</td>
            <td>
              <input class="form-control" v-model="category.paginationWidget" />
            </td>
          </tr>

          <tr>
            <td>
              {{ "Post list under view page" | t }}
            </td>
            <td>
              <label>
                <input type="radio" v-model="category.listOnView" value="Y" />
                {{ "yes" | t }},
              </label>
              &nbsp;
              <label>
                <input type="radio" v-model="category.listOnView" value="N" />
                {{ "no" | t }}
              </label>
            </td>
          </tr>
          <tr>
            <td>{{ "No of posts per page" | t }}</td>
            <td>
              <input
                class="form-control"
                type="text"
                v-model="category.noOfPostsPerPage"
              />
            </td>
          </tr>
          <tr>
            <td nowrap>
              {{ "No of pages on navigator" | t }}
            </td>
            <td>
              <input
                class="form-control"
                type="text"
                v-model="category.noOfPagesOnNav"
              />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <button class="btn btn-sm btn-success w-100" type="submit">
                {{ "submit" | t }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </section>
</template>

<script lang="ts">
import { XFunctions } from "@/x-vue-helper/functions";
import { ApiService } from "@/x-vue/services/api.service";
import { RequestData, CategoryModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
@Component({
  components: {},
})
export default class AdminCategoryEdit extends Vue {
  category: CategoryModel = {} as CategoryModel;

  async mounted(): Promise<void> {
    try {
      this.category = await ApiService.instance.categoryGet({
        id: this.$route.params.categoryId ?? 0,
      });
    } catch (e) {
      XFunctions.instance.error(e);
    }
  }

  async onSubmit(): Promise<void> {
    let options: RequestData = {
      id: this.category.id,
      title: this.category.title,
      description: this.category.description,
      subcategories: this.category.subcategories,
      createPost: this.category.createPost,
      deletePost: this.category.deletePost,
      createComment: this.category.createComment,
      deleteComment: this.category.deleteComment,
      createHourLimit: this.category.createHourLimit,
      createHourLimitCount: this.category.createHourLimitCount,
      createDailyLimitCount: this.category.createDailyLimitCount,
      banCreateOnLimit: this.category.banCreateOnLimit,
      postCreateLimit: this.category.postCreateLimit,
      commentCreateLimit: this.category.commentCreateLimit,
      readLimit: this.category.readLimit,
      returnToAfterPostEdit: this.category.returnToAfterPostEdit,
      postEditWidget: this.category.postEditWidget,
      postEditWidgetOption: this.category.postEditWidgetOption,
      postViewWidget: this.category.postViewWidget,
      postListHeaderWidget: this.category.postListHeaderWidget,
      postListWidget: this.category.postListWidget,
      paginationWidget: this.category.paginationWidget,
      listOnView: this.category.listOnView,
      noOfPostsPerPage: this.category.noOfPostsPerPage,
      noOfPagesOnNav: this.category.noOfPagesOnNav,
      domain: this.category.domain,
    };

    try {
      this.category = await ApiService.instance.categoryUpdate(options);
      XFunctions.instance.alert("Category Update", "Update Success");
    } catch (e) {
      XFunctions.instance.error(e);
    }
  }
}
</script>
