<template>
  <div>
    <h1>Admin Advertisement Settings</h1>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="maximum-advertisement-days"
          >Maximum Advertisement Days</label
        >
        <input
          type="number"
          class="form-control"
          id="maximum-advertisement-days"
          v-model="maximumAdvertisementDays"
        />
        <small class="form-text text-muted">
          Users cannot set advertisement end-date later than this day. For
          instance, if it is set to 5 days, user can set his advertisement only
          for 5 days from today.
        </small>
      </div>
      <div class="form-group">
        <label for="advertisementCategories">Categories</label>
        <input
          type="text"
          class="form-control"
          id="advertisementCategories"
          v-model="advertisementCategories"
        />
        <small class="form-text text-muted">
          Only these categories can display banners. These will appear on banner
          edit form. It can have many categories separating by comma(,). For
          instance, "qna,discussion,job"
        </small>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

    <div class="alert alert-info">
      @todo later, get all countries and make it selectable.
    </div>

    <h3>Add banner points for a country</h3>
    <div>
      Don't input countryCode for default banner point. countryCode 에 빈
      문자열을 입력하면 default setting 이 됨.
    </div>
    <form @submit.prevent="onEdit(add)">
      <!-- <input v-model="add.countryCode" placeholder="2 letter country code" /> -->
      <div class="d-flex w-100">
        <div class="col-3 pr-1">
          <select class="form-control" v-model="add.countryCode">
            <option value="" selected>{{ "default" | t }}</option>
            <option
              v-for="(value, name) in countries"
              :key="name"
              :value="name"
            >
              {{ value }}
            </option>
          </select>
        </div>
        <div class="col-2 px-1">
          <input class="form-control" size="12" v-model="add.top" />
        </div>
        <div class="col-2 px-1">
          <input class="form-control" size="12" v-model="add.sidebar" />
        </div>
        <div class="col-2 px-1">
          <input class="form-control" size="12" v-model="add.square" />
        </div>
        <div class="col-2 px-1">
          <input class="form-control" size="12" v-model="add.line" />
        </div>
        <div class="col-1 p-0">
          <button class="btn btn-primary">ADD</button>
        </div>
      </div>
    </form>

    <table class="table" v-if="points.length">
      <thead>
        <tr>
          <th scope="col">CountryCode</th>
          <th scope="col">Top</th>
          <th scope="col">Sidebar</th>
          <th scope="col">Square</th>
          <th scope="col">Line</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in points.length" :key="n">
          <th scope="row">
            {{
              points[n - 1].countryCode
                ? points[n - 1].countryCode
                : "Default Setting"
            }}
          </th>
          <td><input size="12" v-model="points[n - 1].top" /></td>
          <td><input size="12" v-model="points[n - 1].sidebar" /></td>
          <td><input size="12" v-model="points[n - 1].square" /></td>
          <td><input size="12" v-model="points[n - 1].line" /></td>
          <td>
            <button class="btn btn-primary" @click="onEdit(points[n - 1])">
              Update
            </button>
            <button
              class="btn btn-warning ml-1"
              @click="onDelete(points[n - 1])"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import {
  AdvertisementSettings,
  RequestData,
  ResponseData,
} from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import AdminService from "../../admin.service";

@Component({
  components: {},
})
export default class AdminAdvertisement extends Vue {
  api = ApiService.instance;
  as = AdminService.instance;
  maximumAdvertisementDays = 0;
  advertisementCategories = "";
  points = [] as AdvertisementSettings[];

  add = {};

  countries?: ResponseData = {};

  async mounted(): Promise<void> {
    try {
      let re = await this.api.getConfig("maximumAdvertisementDays");
      this.maximumAdvertisementDays = re.data;
      re = await this.api.getConfig("advertisementCategories");
      this.advertisementCategories = re.data;

      this.points = await this.api.advertisementGetBannerPoints();

      this.countries = await this.api.countryAll();
    } catch (e) {
      this.as.error(e);
    }
  }

  // /**
  //  * Country data list getter.
  //  * @returns ResponseData - gets country list from store state.
  //  */
  // get countries(): ResponseData {
  //   return store.state.countries;
  // }

  async onEdit(data: RequestData): Promise<void> {
    // console.log("onEdit", data);
    try {
      await this.api.advertisementSetBannerPoint(data);
      this.points = await this.api.advertisementGetBannerPoints();

      let msg = `Points for ${data.countryCode} is `;
      if (data.idx) {
        console.log("onEdit::update", this.points);
        msg += " updated.";
      } else {
        console.log("onEdit::add", this.points);
        msg += " added.";
        this.add = {};
      }
      this.as.alert("Points " + msg);
      // this.as.openToast("Points", msg, undefined, "success", true, 3000);
    } catch (e) {
      this.as.error(e);
    }
  }

  async onDelete(data: RequestData): Promise<void> {
    // console.log("onDelete::data", data);

    const conf = this.as.confirm(
      `Delete point settings for ${data.countryCode}?`
    );
    if (!conf) return;
    // console.log("onDelete::confirm::idx", data.idx);
    try {
      await this.api.advertisementDeleteBannerPoint(data.idx);
      this.points = await this.api.advertisementGetBannerPoints();
    } catch (e) {
      this.as.error(e);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      await this.api.setConfig(
        "maximumAdvertisementDays",
        this.maximumAdvertisementDays
      );
      await this.api.setConfig(
        "advertisementCategories",
        this.advertisementCategories
      );

      this.as.alert("Saved!");

      // this.as.openToast("Settings", "Saved...", undefined, "info", true, 3000);
    } catch (e) {
      this.as.error(e);
    }
  }
}
</script>
