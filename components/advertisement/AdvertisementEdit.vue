<template>
  <section>
    <form class="p-2" @submit.prevent="onSubmit" v-if="!loading">
      <div class="mb-2" v-if="banner.idx">
        You are posting banner on <b>{{ countryName }}</b>
      </div>

      <AdvertisementActivePanel
        :advertisement="banner"
        :noOfDays="noOfDays"
        :refundablePoints="refundablePoints"
        :servingDaysLeft="servingDaysLeft"
        :isRefundable="isRefundable"
        :countryName="countryName"
        @onClickStop="onAdvertisementStop"
      ></AdvertisementActivePanel>

      <AdvertisementInactivePanel
        :advertisement="banner"
        :settings="settings"
        :bannerPoints="bannerPoints"
        :servingDaysLeft="servingDaysLeft"
        :noOfDays="noOfDays"
        @onClickStart="onAdvertisementStart"
      ></AdvertisementInactivePanel>

      <div class="box mt-3 p-3">
        <h2 v-if="banner.idx == 0">Creating banner</h2>
        <h2 v-else>Updating banner</h2>

        <section class="mb-2" v-if="cafeCountryCode">
          You are posting banner on <b>{{ countryName }}</b>
        </section>
        <section class="mt-3" v-else>
          <!-- Banner country -->
          <div class="form-group mt-2" v-if="countries">
            <label>{{ "adv_cafe_country" | t }}</label>

            <select value="" class="form-control" v-model="banner.countryCode" :disabled="banner.isActive">
              <option disabled selected>{{ "select_country" | t }}</option>
              <option value="AC">{{ "all_country" | t }}</option>
              <option v-for="(value, name) in countries" :key="name" :value="name">
                {{ value }}
              </option>
            </select>
            <small class="form-text text-muted">
              {{ "adv_cafe_country_hint" | t }}
            </small>
          </div>
        </section>

        <!-- title -->
        <div class="form-group">
          <label>{{ "title" | t }}</label>
          <input class="form-control" :placeholder="'title' | t" type="text" v-model="banner.title" />
        </div>

        <!-- subcategory -->
        <div class="form-group mt-2">
          <label>{{ "category" | t }}</label>
          <select class="form-control" v-model="banner.subcategory">
            <option value="" selected>
              {{ "global" | t }}
            </option>
            <option v-for="category in settings.categoryArray" :key="category">
              {{ category }}
            </option>
          </select>
          <small class="form-text text-muted">
            {{ "adv_category_hint_b" | t }}
          </small>
        </div>

        <!-- Banner points country listing table -->
        <BannerPointListingTable
          :settings="settings"
          :countryName="countryName"
          :bannerPoints="bannerPoints"
          :cafeCountryCode="cafeCountryCode"
        ></BannerPointListingTable>
        <hr />
        <!-- Banner type selection -->
        <BannerType :settings="settings" :banner="banner"></BannerType>

        <!-- banner -->
        <div class="box mt-4">
          <label>{{ "adv_banner" | t }}</label>
          <UploadImage
            taxonomy="posts"
            :entity="banner.idx"
            code="banner"
            @uploaded="onFileUpload"
            @deleted="onFileDelete"
            v-if="isMounted"
          ></UploadImage>
          <small class="form-text text-muted">
            {{ "adv_banner_description" | t }}
          </small>
        </div>

        <!-- content banner -->
        <div class="box mt-2">
          <label>{{ "adv_content_banner" | t }}</label>
          <UploadImage
            taxonomy="posts"
            :entity="banner.idx"
            code="content"
            @uploaded="onFileUpload"
            @deleted="onFileDelete"
            v-if="isMounted"
          ></UploadImage>
          <small class="form-text text-muted">
            {{ "adv_banner_description" | t }}
          </small>
        </div>

        <!-- content -->
        <div class="form-group mt-4">
          <label>{{ "content" | t }}</label>
          <textarea
            class="form-control"
            :placeholder="'content' | t"
            type="text"
            v-model="banner.content"
            rows="5"
          ></textarea>
        </div>

        <!-- memo -->
        <div class="form-group mt-2">
          <label>{{ "adv_memo" | t }}</label>
          <textarea
            class="form-control"
            :placeholder="'adv_memo' | t"
            v-model="banner.privateContent"
            rows="2"
          ></textarea>
          <small class="form-text text-muted">
            {{ "adv_memo_hint" | t }}
          </small>
        </div>

        <div class="form-group mt-2">
          <label>{{ "click_url" | t }}</label>
          <input class="form-control" :placeholder="'click_url' | t" type="text" v-model="banner.clickUrl" />
          <small class="form-text text-muted">
            {{ "click_url_hint" | t }}
          </small>
        </div>

        <div class="d-flex">
          <!-- delete -->
          <button
            class="mt-2 btn btn-outline-danger"
            type="button"
            @click="advertisementDelete"
            v-if="banner.idx && banner.isInactive"
          >
            {{ "delete" | t }}
          </button>
          <span class="flex-grow-1"></span>
          <!-- save / update -->
          <button class="mt-2 btn btn-outline-success" type="submit" v-if="!isSubmitted">
            <span v-if="banner.idx">{{ "update" | t }}</span>
            <span v-if="!banner.idx">{{ "save" | t }}</span>
          </button>
          <b-spinner class="m-2" type="grow" variant="success" v-if="isSubmitted"></b-spinner>
        </div>
      </div>
    </form>

    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Loading ...
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import dayjs from "dayjs";
import { ApiService } from "@/x-vue/services/api.service";
import { AdvertisementSettings, FileModel, ResponseData } from "@/x-vue/interfaces/interfaces";
import { addByComma, daysBetween, deleteByComma, translate } from "@/x-vue/services/functions";
import { AdvertisementModel } from "@/x-vue/interfaces/advertisement.interface";
import { AdvertisementService } from "@/x-vue/services/advertisement.service";
import BannerType from "@/x-vue/components/advertisement/AdvertisementEditBannerType.vue";
import ComponentService from "@/x-vue/services/component.service";

import LoginFirst from "@/x-vue/components/user/LoginFirst.vue";
import UploadImage from "@/x-vue/components/file/UploadImage.vue";
import AdvertisementActivePanel from "@/x-vue/components/advertisement/AdvertisementActivePanel.vue";
import AdvertisementInactivePanel from "@/x-vue/components/advertisement/AdvertisementInactivePanel.vue";
import BannerPointListingTable from "@/x-vue/components/advertisement/BannerPointListingTable.vue";

@Component({
  components: {
    UploadImage,
    LoginFirst,
    BannerType,
    AdvertisementActivePanel,
    AdvertisementInactivePanel,
    BannerPointListingTable,
  },
})
export default class extends Vue {
  @Prop() cafeCountryCode!: string;

  api = ApiService.instance;
  s = ComponentService.instance;

  isMounted = false;

  banner: AdvertisementModel = new AdvertisementModel();

  uploadProgress = 0;

  isSubmitted = false;

  loading = true;

  countries: ResponseData = {};

  // Global advertisement settings
  settings: AdvertisementSettings = {} as AdvertisementSettings;

  // Returns country name based on banner's country code or current cafe's country code.
  get countryName(): string {
    if (this.banner.countryCode === "AC") return translate("all_country");
    return this.countries[this.banner.countryCode];
  }

  get bannerPoints(): ResponseData {
    if (!this.settings.point) return {};
    return this.settings.point[this.banner.countryCode];
  }

  async mounted(): Promise<void> {
    // console.log("mounted::banner", this.banner);

    this.loadCountries();
    this.loadGlobalSettings();

    const idx = parseInt(this.$route.params.idx);
    if (idx) {
      this.banner.idx = idx;
      await this.loadAdvertisement();
    } else {
      this.banner.categoryId = "advertisement";
      if (this.cafeCountryCode == "") this.banner.countryCode = "AC";
      else this.banner.countryCode = this.cafeCountryCode;
    }

    this.loading = false;
    this.isMounted = true;
  }

  async loadCountries(): Promise<void> {
    try {
      this.countries = await this.api.countryAll();
    } catch (e) {
      this.s.error(e);
    }
  }

  async loadGlobalSettings(): Promise<void> {
    try {
      const _globalSettings = await AdvertisementService.instance.advertisementSettings();
      this.settings = _globalSettings;
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }

  get today(): string {
    return dayjs().format("YYYY-MM-DD");
  }

  /**
   * @returns number - returns the total range of days the user selected from beginAt to endAt dates.
   */
  get noOfDays(): number {
    if (dayjs(this.banner.beginDate).isSame(this.banner.endDate, "d")) return 1;
    const days = daysBetween(this.banner.beginDate, this.banner.endDate);
    if (!days) return 0;
    return days + 1;
  }

  /**
   * Will return 0 if:
   *  - The advertisement is due.
   *  - Today is same date as 'endDate'.
   *
   * @returns number
   */
  get servingDaysLeft(): number {
    if (!this.isRefundable) return this.noOfDays;
    // Advertisement is due or expired.
    if (dayjs().isAfter(this.banner.endDate, "d")) return 0;
    else return daysBetween(this.today, this.banner.endDate);
  }

  /**
   * Will return true if:
   *  - 'beginDate' is equivalent as today.
   *  - 'beginDate' is equivalent as yesterday or earlier.
   *
   * @returns boolean
   */
  get isRefundable(): boolean {
    if (dayjs().isSame(this.banner.beginDate, "day")) return true;
    return dayjs().isAfter(this.banner.beginDate, "day");
  }

  /**
   * Will return 0 if:
   *  - servingDaysLeft is smaller than 0 (negative).
   *
   * @returns number
   */
  get refundablePoints(): number {
    if (this.servingDaysLeft < 0) return 0;
    return this.servingDaysLeft * this.banner.pointPerDay;
  }

  async loadAdvertisement(): Promise<void> {
    try {
      this.banner = await AdvertisementService.instance.advertisementGet({ idx: this.banner.idx });
    } catch (e) {
      this.s.error(e);
    }
  }

  async onSubmit(): Promise<void> {
    // set cafeCountryCode to banner country code.
    // If cafeCountryCode is undefined, then, user can choose one.
    if (this.cafeCountryCode) this.banner.countryCode = this.cafeCountryCode;
    // console.log("onSubmit", this.banner.toJson);

    if (this.isSubmitted) return;
    this.isSubmitted = true;
    let isCreate = true;
    if (this.banner.idx) isCreate = false;
    try {
      const res = await AdvertisementService.instance.advertisementEdit(this.banner.toJson);
      Object.assign(this.banner, res);
      if (isCreate) {
        this.s.open(`/advertisement/edit/${this.banner.idx}`);
      } else {
        this.s.toast({
          title: "Updated",
          message: "Advertisement successfully updated!",
        });
      }
      this.isSubmitted = false;
    } catch (e) {
      this.s.error(e);
      this.isSubmitted = false;
    }
  }

  /**
   * Starts the advertisement.
   */
  async onAdvertisementStart(): Promise<void> {
    try {
      const res = await AdvertisementService.instance.advertisementStart(this.banner.toJson);
      this.banner = res;
      this.$emit("start");
    } catch (e) {
      this.s.error(e);
    }
  }

  async onAdvertisementStop(): Promise<void> {
    const conf = await this.s.confirm("Title", "Are you sure you want to cancel the advertisement?");
    if (!conf) return;
    try {
      this.banner = await AdvertisementService.instance.advertisementStop(this.banner.idx);
      this.$emit("stop");
    } catch (e) {
      this.s.error(e);
    }
  }

  async advertisementDelete(): Promise<void> {
    const conf = await this.s.confirm("Title", "Are you sure you want to delete the advertisement?");
    if (!conf) return;
    try {
      this.banner = await AdvertisementService.instance.advertisementDelete(this.banner.idx);
      this.s.open("/advertisement");
    } catch (e) {
      this.s.error(e);
    }
  }

  onFileUpload(file: FileModel): void {
    this.banner.fileIdxes = addByComma(this.banner.fileIdxes, file.idx);
    console.log("onFileUpload", this.banner.fileIdxes);
  }

  onFileDelete(idx: string): void {
    this.banner.fileIdxes = deleteByComma(this.banner.fileIdxes, idx);
    console.log("onFileDelete", this.banner.fileIdxes);
  }
}
</script>
