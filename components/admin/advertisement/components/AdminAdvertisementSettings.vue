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
        <label for="maximum-advertisement-days">Maximum number of banners on each category</label>
        <table class="table">
          <thead>
            <tr>
              <td>Banner</td>
              <td>Global</td>
              <td>Category</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Top banner</th>
              <td><input type="number" v-model="maxNoOnGlobalTopBanner" /></td>
              <div>
                <input type="number" v-model="maxNoOnCategoryTopBanner" />
              </div>
            </tr>
            <tr>
              <th scope="row">Sidebar banner</th>
              <td><input type="number" v-model="maxNoOnGlobalSidebarBanner" /></td>
              <div>
                <input type="number" v-model="maxNoOnCategorySidebarBanner" />
              </div>
            </tr>
            <tr>
              <th scope="row">Square banner</th>
              <td><input type="number" v-model="maxNoOnGlobalSquareBanner" /></td>
              <div>
                <input type="number" v-model="maxNoOnCategorySquareBanner" />
              </div>
            </tr>
            <tr>
              <th scope="row">Line banner</th>
              <td><input type="number" v-model="maxNoOnGlobalLineBanner" /></td>
              <div>
                <input type="number" v-model="maxNoOnCategoryLineBanner" />
              </div>
            </tr>
          </tbody>
        </table>
        <small class="form-text text-muted"> @see README.md </small>
      </div>

      <div class="form-group">
        <label for="advertisementCategories">Categories</label>
        <input type="text" class="form-control" id="advertisementCategories" v-model="advertisementCategories" />
        <small class="form-text text-muted">
          Categories to display banners on. These categories will appear on banner edit form. You can input many
          categories separating by comma(,). For instance, "qna,discussion,job"
        </small>
      </div>
      <div class="form-group">
        <label for="globalBannerMultiplying">Global banner price by multiplying</label>
        <input type="number" class="form-control" id="globalBannerMultiplying" v-model="globalBannerMultiplying" />
        <small class="form-text text-muted">
          Global banner has more change to be displayed on many subcategories. So, it should be expansive than
          categories banners. Input how many times to multiply on each banner price. @see README.md for details.
        </small>
        <small class="form-text text-muted">Recommend value for global banner multiplying is: <b>4</b></small>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <hr />
    <h3>Add banner points for a country</h3>
    <form @submit.prevent="onEdit(add)">
      <!-- <input v-model="add.countryCode" placeholder="2 letter country code" /> -->
      <div class="row no-gutters w-100">
        <div class="col-3 pl-0 pr-1">
          {{ "country" | t }}
          <select class="form-control" v-model="add.countryCode">
            <option value="" selected>{{ "default" | t }}</option>
            <option value="AC" selected>{{ "all_country" | t }}</option>
            <option v-for="(value, _countryCode) in countries" :key="_countryCode" :value="_countryCode">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="col-2 px-1">
          {{ "top" | t }}
          <input type="number" class="form-control" v-model="add.top" />
        </div>
        <div class="col-2 px-1">
          {{ "sidebar" | t }}
          <input type="number" class="form-control" v-model="add.sidebar" />
        </div>
        <div class="col-2 px-1">
          {{ "square" | t }}
          <input type="number" class="form-control" v-model="add.square" />
        </div>
        <div class="col-2 px-1">
          {{ "line" | t }}
          <input type="number" class="form-control" v-model="add.line" />
        </div>
        <div class="col-1 pl-1 pr-0">
          <button class="btn btn-primary mt-4">
            {{ "add" | t }}
          </button>
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
          <th scope="row" class="p-1">
            {{ countryName(points[n - 1].countryCode) }}
          </th>
          <td class="p-1"><input class="form-control px-1" type="number" v-model="points[n - 1].top" /></td>
          <td class="p-1"><input class="form-control px-1" type="number" v-model="points[n - 1].sidebar" /></td>
          <td class="p-1"><input class="form-control px-1" type="number" v-model="points[n - 1].square" /></td>
          <td class="p-1"><input class="form-control px-1" type="number" v-model="points[n - 1].line" /></td>
          <td class="p-1 d-flex">
            <button class="w-100 btn btn-primary btn-sm mr-1" @click="onEdit(points[n - 1])">Update</button>
            <button class="w-100 btn btn-warning btn-sm" @click="onDelete(points[n - 1])">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ul>
      <li>
        Default is the default point that will apply all the countries by default unless country are set above. @see
        readme.
      </li>
      <li>
        All countries is for displaying a banner on all countries. The point must be expansive since the banner is
        displayed on all country.<br />
        전체 국가는 배너가 모든 국가에 다 나오므로, 비용이 비싸야 한다.
      </li>
      <li>
        All countries banner must apply global multiplying also.
        <br />
        전체 국가에 배너를 등록 할 때, global multiplying 이 적용된다. 이 뜻은, top banner 의 포인트를 입력 할 때,
        기본적으로 하나의 카테고리에 대한 금액이다. 만약, global banner 로 등록하면, 전체 국가의 포인트에서 global
        multiplying 한 금액이 적용되어야 한다. 예를 들면, 전체 국가 top banner 가 1만 포인트이고, global multiplying 이
        4 라면, 전체 국가의 global top banner 는 4만 포인트가 된다.
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementPointSetting, RequestData, ResponseData } from "@/x-vue/interfaces/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import Service from "@/x-vue/services/component.service";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import { translate } from "@/x-vue/services/functions";

@Component({
  components: {},
})
export default class AdminAdvertisement extends Vue {
  api = ApiService.instance;
  s = Service.instance;
  maximumAdvertisementDays = 0;
  advertisementCategories = "";
  globalBannerMultiplying = 0;
  maxNoOnGlobalTopBanner = 0;
  maxNoOnCategoryTopBanner = 0;
  maxNoOnGlobalSidebarBanner = 0;
  maxNoOnCategorySidebarBanner = 0;
  maxNoOnGlobalSquareBanner = 0;
  maxNoOnCategorySquareBanner = 0;
  maxNoOnGlobalLineBanner = 0;
  maxNoOnCategoryLineBanner = 0;

  points = [] as AdvertisementPointSetting[];

  add = {};

  countries: ResponseData = {};

  countryName(code: string): string {
    if (code == "") return translate("default_banner_point_setting");
    else if (code == "AC") return translate("all_country");
    return this.countries[code];
  }

  async mounted(): Promise<void> {
    try {
      const settings = await AdvertisementService.instance.advertisementSettings();
      console.log(settings);

      // let re = await this.api.getConfig("maximumAdvertisementDays");
      // this.maximumAdvertisementDays = re.data ? re.data : 0;
      this.maximumAdvertisementDays = settings.maximumAdvertisementDays;

      this.maxNoOnGlobalTopBanner = settings.maxNoOnGlobalTopBanner;
      this.maxNoOnCategoryTopBanner = settings.maxNoOnCategoryTopBanner;
      this.maxNoOnGlobalSidebarBanner = settings.maxNoOnGlobalSidebarBanner;
      this.maxNoOnCategorySidebarBanner = settings.maxNoOnCategorySidebarBanner;
      this.maxNoOnGlobalSquareBanner = settings.maxNoOnGlobalSquareBanner;
      this.maxNoOnCategorySquareBanner = settings.maxNoOnCategorySquareBanner;
      this.maxNoOnGlobalLineBanner = settings.maxNoOnGlobalLineBanner;
      this.maxNoOnCategoryLineBanner = settings.maxNoOnCategoryLineBanner;

      // re = await this.api.getConfig("advertisementCategories");
      this.advertisementCategories = settings.categoryArray.join(",");
      this.globalBannerMultiplying = settings.globalBannerMultiplying;

      this.points = await AdvertisementService.instance.advertisementGetBannerPoints();
      // this.points = Object.keys(settings.point).map((k) => {
      //   settings.point[k].countryCode = k;
      //   return settings.point[k];
      // });

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
      this.s.alert("Success", "Point setting updated!");
    } catch (e) {
      this.s.error(e);
    }
  }

  async onDelete(data: RequestData): Promise<void> {
    console.log("onDelete::data", data);

    const conf = await this.s.confirm("Confirm", `Delete point settings for ${data.countryCode}?`);
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
      await this.api.setConfig("globalBannerMultiplying", this.globalBannerMultiplying);

      await this.api.setConfig("maxNoOnGlobalTopBanner", this.maxNoOnGlobalTopBanner);
      await this.api.setConfig("maxNoOnCategoryTopBanner", this.maxNoOnCategoryTopBanner);
      await this.api.setConfig("maxNoOnGlobalSidebarBanner", this.maxNoOnGlobalSidebarBanner);
      await this.api.setConfig("maxNoOnCategorySidebarBanner", this.maxNoOnCategorySidebarBanner);
      await this.api.setConfig("maxNoOnGlobalSquareBanner", this.maxNoOnGlobalSquareBanner);
      await this.api.setConfig("maxNoOnCategorySquareBanner", this.maxNoOnCategorySquareBanner);
      await this.api.setConfig("maxNoOnGlobalLineBanner", this.maxNoOnGlobalLineBanner);
      await this.api.setConfig("maxNoOnCategoryLineBanner", this.maxNoOnCategoryLineBanner);

      this.s.alert("Settings", "Saved!");
    } catch (e) {
      this.s.error(e);
    }
  }
}
</script>
