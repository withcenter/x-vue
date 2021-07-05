<template>
  <div>
    <h1>Admin Advertisement Settings</h1>

    <form class="mb-3" @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="maximum-advertisement-days">Maximum Advertisement Days</label>
        <input type="number" class="form-control" id="maximum-advertisement-days" v-model="maximumAdvertisementDays" />
        <small class="form-text text-muted">
          Users cannot set advertisement end-date later than this day. For instance, if it is set to 5 days, user can
          set his advertisement only for 5 days from today.
        </small>
      </div>
      <div class="form-group">
        <label for="advertisementCategories">Categories</label>
        <input type="text" class="form-control" id="advertisementCategories" v-model="advertisementCategories" />
        <small class="form-text text-muted">
          Only these categories can display banners. These will appear on banner edit form. It can have many categories
          separating by comma(,). For instance, "qna,discussion,job"
        </small>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <hr />
    <h3>Add banner points for a country</h3>
    <form @submit.prevent="onEdit(add)">
      <!-- <input v-model="add.countryCode" placeholder="2 letter country code" /> -->
      <div class="d-flex w-100">
        <div class="col-3 pl-0 pr-1">
          <select class="form-control" v-model="add.countryCode">
            <option value="" selected>{{ "default" | t }}</option>
            <option v-for="(value, name) in countries" :key="name" :value="name">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="col-2 px-1">
          <input type="number" class="form-control" v-model="add.top" />
        </div>
        <div class="col-2 px-1">
          <input type="number" class="form-control" v-model="add.sidebar" />
        </div>
        <div class="col-2 px-1">
          <input type="number" class="form-control" v-model="add.square" />
        </div>
        <div class="col-2 px-1">
          <input type="number" class="form-control" v-model="add.line" />
        </div>
        <div class="col-1 pl-1 pr-0">
          <button class="btn btn-primary">ADD</button>
        </div>
      </div>
      <div class="mt-2 alert alert-info">
        Don't input countryCode for default banner point. countryCode 에 빈 문자열을 입력하면 default setting 이 됨.
      </div>
    </form>

    <table class="mt-3 w-100 table" v-if="points.length">
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
            {{ points[n - 1].countryCode ? points[n - 1].countryCode : "Default Setting" }}
          </th>
          <td>
            <input class="form-control" type="number" v-model="points[n - 1].top" />
          </td>
          <td>
            <input class="form-control" type="number" v-model="points[n - 1].sidebar" />
          </td>
          <td>
            <input class="form-control" type="number" v-model="points[n - 1].square" />
          </td>
          <td>
            <input class="form-control" type="number" v-model="points[n - 1].line" />
          </td>
          <td>
            <button class="w-100 btn btn-primary" @click="onEdit(points[n - 1])">Update</button>
            <button class="w-100 btn btn-warning" @click="onDelete(points[n - 1])">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementPointSetting, RequestData, ResponseData } from "@/x-vue/interfaces/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import Service from "@/x-vue/services/component.service";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";

@Component({
  components: {},
})
export default class AdminAdvertisement extends Vue {
  api = ApiService.instance;
  s = Service.instance;
  maximumAdvertisementDays = 0;
  advertisementCategories = "";
  points = [] as AdvertisementPointSetting[];

  add = {};

  countries?: ResponseData = {};

  async mounted(): Promise<void> {
    try {
      const settings = await AdvertisementService.instance.advertisementSettings();

      // let re = await this.api.getConfig("maximumAdvertisementDays");
      // this.maximumAdvertisementDays = re.data ? re.data : 0;
      this.maximumAdvertisementDays = settings.maximumAdvertisementDays;
      // re = await this.api.getConfig("advertisementCategories");
      this.advertisementCategories = settings.categories.join(",");

      // this.points = await AdvertisementService.instance.advertisementGetBannerPoints();
      this.points = Object.keys(settings.point).map((k) => {
        settings.point[k].countryCode = k;
        return settings.point[k];
      });

      this.countries = await this.api.countryAll();
    } catch (e) {
      this.s.error(e);
    }
  }

  async onEdit(data: RequestData): Promise<void> {
    // console.log("onEdit", data);
    try {
      await AdvertisementService.instance.advertisementSetBannerPoint(data);
      this.points = await AdvertisementService.instance.advertisementGetBannerPoints();
      this.add = {};
      this.s.alert("Points ", "Point setting updated!");
    } catch (e) {
      this.s.error(e);
    }
  }

  async onDelete(data: RequestData): Promise<void> {
    // console.log("onDelete::data", data);

    const conf = await this.s.confirm("Title", `Delete point settings for ${data.countryCode}?`);
    if (!conf) return;
    try {
      await AdvertisementService.instance.advertisementDeleteBannerPoint(data.idx);
      this.points = await AdvertisementService.instance.advertisementGetBannerPoints();
    } catch (e) {
      this.s.error(e);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      await this.api.setConfig("maximumAdvertisementDays", this.maximumAdvertisementDays);
      await this.api.setConfig("advertisementCategories", this.advertisementCategories);

      this.s.alert("Settings", "Saved!");
    } catch (e) {
      this.s.error(e);
    }
  }
}
</script>
