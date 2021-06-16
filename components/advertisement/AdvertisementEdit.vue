<template>
  <div v-if="settings">
    <form class="p-2" @submit.prevent="onSubmit">
      <div class="box mb-2" v-if="post.isAdvertisementActive">
        <div class="d-flex">
          <span>
            {{ "adv_banner_type" | t }}
            <h2>{{ post.code }}</h2>
          </span>
          <!-- <span class="flex-grow-1"></span> -->
          <span class="ml-4">
            {{ "country" | t }}
            <h2>{{ countries[post.countryCode] }}</h2>
          </span>
        </div>
        <div class="mt-3">
          {{ "adv_banner_dates" | t }}
          <h2>{{ post.beginDate }} ~ {{ post.endDate }}</h2>
        </div>

        <!-- TODO: Cancel, Refund, Delete -->
        <div class="mt-3">
          <div class="alert alert-info" v-if="servingDaysLeft">
            <div class="d-flex">
              <span class="mr-3">
                {{ "adv_days" | t }}: <b>{{ noOfDays }}</b>
              </span>
              <span class="mr-3">
                {{ "advertisement_serving_days" | t }}:
                <b>{{ servingDaysLeft }}</b>
              </span>
            </div>
            <div class="d-flex mt-2">
              <span class="mr-3">
                {{ "adv_points_per_day" | t }}:
                <b>{{ countryPointListing[post.code] }}</b>
              </span>
              <span>
                {{ "adv_refundable_points" | t }}:
                <b>{{ refundablePoints }}</b>
              </span>
            </div>
            <small class="text-info">
              {{ "adv_refundable_points_hint" | t }}
            </small>
          </div>
          <button
            class="w-100 btn btn-outline-danger"
            type="button"
            v-if="isCancellable"
            @click="onAdvertisementStop"
          >
            {{ "cancel_advertisement" | t }}
          </button>
          <button
            class="w-100 mt-2 btn btn-outline-info"
            type="button"
            v-if="isRefundable"
            @click="onAdvertisementStop"
          >
            {{ "stop_advertisement" | t }}
          </button>
        </div>
      </div>

      <div class="mb-2" v-if="post.idx && !post.isAdvertisementActive">
        <!-- banner type -->
        <div class="form-group mt-2">
          <label>{{ "adv_banner_type" | t }}</label>
          <select
            class="form-control"
            v-model="post.code"
            :disabled="post.isAdvertisementActive"
          >
            <option value="" disabled selected>{{ "select_type" | t }}</option>
            <option v-for="type in settings.types" :key="type">
              {{ type }}
            </option>
          </select>
          <small class="form-text text-muted">
            {{ "adv_banner_type_hint" | t }}
          </small>
        </div>

        <!-- Banner country -->
        <div class="form-group mt-2" v-if="countries">
          <label>{{ "adv_cafe_country" | t }}</label>
          <select
            value=""
            class="form-control"
            v-model="post.countryCode"
            :disabled="post.isAdvertisementActive"
          >
            <option disabled selected>{{ "select_country" | t }}</option>
            <option
              v-for="(value, name) in countries"
              :key="name"
              :value="name"
            >
              {{ value }}
            </option>
          </select>
          <small class="form-text text-muted">
            {{ "adv_cafe_country_hint" | t }}
          </small>
        </div>

        <div class="box" v-if="post.code">
          {{ "adv_points_per_day" | t }}:
          <b>{{ countryPointListing[post.code] }}</b> <br />
          <small class="text-info">
            {{ "adv_points_per_day_hint" | t }}
          </small>
        </div>

        <!-- banner start and end date -->
        <div class="form-group bg-light p-3 mt-3">
          <label>{{ "advertisement_begin_end_date" | t }}</label>
          <div class="d-flex justify-content-between">
            <label>
              {{ "adv_begin_date" | t }}
              <input
                v-model="post.beginDate"
                type="date"
                :max="beginAtMax"
                :disabled="post.isAdvertisementActive"
              />
            </label>
            <label>
              {{ "adv_end_date" | t }}
              <input
                v-model="post.endDate"
                type="date"
                :min="endAtMin"
                :disabled="post.isAdvertisementActive"
              />
            </label>
          </div>

          <small class="form-text text-muted mb-2">
            {{ "advertisement_serving_days" | t }}: <b>{{ servingDaysLeft }}</b>
            {{ "days" | t }}
          </small>
          <small class="form-text text-muted mb-2">
            {{ "adv_no_of_days" | t }}: {{ noOfDays }}
          </small>
          <small class="form-text text-muted">
            {{ "adv_no_of_days_hint_a" | t }}
          </small>
          <small class="form-text text-muted">
            {{ "adv_no_of_days_hint_b" | t }}
          </small>
          <small class="form-text text-muted">
            {{ "adv_no_of_days_hint_c" | t }}
          </small>
        </div>

        <!-- Total Advertisement price in points -->
        <div class="alert alert-info" v-if="priceInPoint">
          {{ "adv_total_points_required" | t }}: <b>{{ priceInPoint }}</b
          ><br />
          <small class="text-info">
            {{ "adv_total_points_required_hint" | t }}
          </small>
        </div>

        <!-- Save Advertisement -->
        <div class="mt-2">
          <button
            class="w-100 btn btn-outline-success"
            type="button"
            :disabled="isPointInsufficient"
            @click="onAdvertisementStart"
          >
            {{ "start_advertisement" | t }}
          </button>
          <small class="text-danger" v-if="isPointInsufficient">
            {{ "start_advertisement_warning" | t }}
          </small>
          <br />
        </div>
      </div>

      <div class="box">
        <!-- title -->
        <div class="form-group">
          <label>{{ "title" | t }}</label>
          <input
            class="form-control"
            :placeholder="'title' | t"
            type="text"
            v-model="post.title"
          />
        </div>

        <!-- subcategory -->
        <div class="form-group mt-2">
          <label>{{ "category" | t }}</label>
          <select class="form-control" v-model="post.subcategory">
            <option value="" disabled selected>
              {{ "adv_category_hint_a" | t }}
            </option>
            <option v-for="category in settings.categories" :key="category">
              {{ category }}
            </option>
          </select>
          <small class="form-text text-muted">
            {{ "adv_category_hint_b" | t }}
          </small>
        </div>

        <!-- banner -->
        <div class="box mt-4">
          <label>{{ "adv_banner" | t }}</label>
          <upload-image
            taxonomy="posts"
            :entity="post.idx"
            code="banner"
            @uploaded="onFileUpload"
            v-if="isMounted"
          ></upload-image>
          <small class="form-text text-muted">
            {{ "adv_banner_description" | t }}
          </small>
        </div>

        <!-- content banner -->
        <div class="box mt-2">
          <label>{{ "adv_content_banner" | t }}</label>
          <upload-image
            taxonomy="posts"
            :entity="post.idx"
            code="content"
            @uploaded="onFileUpload"
            v-if="isMounted"
          ></upload-image>
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
            v-model="post.content"
            rows="5"
          ></textarea>
        </div>

        <!-- memo -->
        <div class="form-group mt-2">
          <label>{{ "adv_memo" | t }}</label>
          <textarea
            class="form-control"
            :placeholder="'adv_memo' | t"
            type="text"
            v-model="post.privateContent"
            rows="2"
          ></textarea>
          <small class="form-text text-muted">
            {{ "adv_memo_hint" | t }}
          </small>
        </div>

        <div class="d-flex">
          <!-- delete -->
          <button
            class="mt-2 btn btn-outline-danger"
            type="button"
            @click="onClickDelete"
            v-if="post.idx"
            :disabled="post.isAdvertisementActive"
          >
            {{ "delete" | t }}
          </button>
          <span class="flex-grow-1"></span>
          <!-- save / update -->
          <button class="mt-2 btn btn-outline-success" type="submit">
            <span v-if="post.idx">{{ "update" | t }}</span>
            <span v-if="!post.idx">{{ "save" | t }}</span>
          </button>
        </div>

        <!-- Banner points country listing table -->
        <div class="mt-3 box" v-if="post.idx">
          <p>
            {{ "adv_point_listing" | t }}:
            <span v-if="post.countryCode">
              {{ post.countryCode }} - {{ countries[post.countryCode] }}
            </span>
            <span v-if="!post.countryCode">{{ "default" | t }}</span>
          </p>
          <table class="w-100 mt-2 table table-striped">
            <thead>
              <tr class="table-header">
                <th scope="col">{{ "adv_banner_type" | t }}</th>
                <th scope="col">{{ "adv_points_per_day" | t }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, name) in countryPointListing" :key="name">
                <td>{{ name }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
          <small class="text-info">
            {{ "adv_point_listing_hint" | t }}
          </small>
        </div>
      </div>
    </form>

    <!-- TODOS:
        
      @todo If there is no advertisement, guide the user how to create first
      advertisement esialy.

      @todo when user change dates, display the price (point).
      @todo If the user is lack of point, display warning.  

      @todo After save, display one of "cancel" or "refund" button.
      @todo When the user press save button, deduct the point from user. And
      the date is no loger changable.
      
      @todo Delete button will be shown if the banner has no point. Meaning 
      1) the user may not have paid the point yet.
      2) the banner was cancelled, or refunded.
      In which case, the banner can be deleted without point
      refund computation, then "delete button" will be displayed.

      @todo Cancel button will be shown if the banner has not begin yet.
      @todo Refund button will be shown if the banner has begun.
      @todo add stop button when advertisement is due or neither refundable nor cancellable
      @todo after cancel or refund, display "resume the advertisement" or "delete" button.

      @todo 무통장 입금 표시. 세금을 포함해서 계산한다.
    
      @todo 경고. 회원 활동으로 획득한 포인트를 광고에 이용 할 수 있습니다.
      하지만, 직접 활동하여 얻는 포인트(예, 포인트가 많은 다른 사용자의 계정으로
      광고 등록)하면, 광고 해지 및 포인트 0점 처리, 그리고 영구 차단이 되므로
      주의하시기 바랍니다.

      @doc 광고가 진행되면, 날짜, 국가, 광고 위치는 변경 불가하다. 이 세 가지를
      변경하면 광고비 설정이 달라지기 때문에, 취소 또는 환불 후 다시 설정해야
      한다. 다만, 게시판이나 글로벌의 위치는 변경 할 수 있다.
     -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  AdvertisementSettings,
  FileModel,
  PostModel,
  ResponseData,
} from "@/x-vue/services/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { addByComma, daysBetween } from "@/x-vue/services/functions";
import store from "@/store";
import UploadImage from "@/x-vue/components/file/UploadImage.vue";
import dayjs from "dayjs";

@Component({
  components: { UploadImage },
})
export default class Advertisement extends Vue {
  api = ApiService.instance;
  isMounted = false;

  post = new PostModel();

  uploadProgress = 0;

  beginAtMin = "";

  async mounted(): Promise<void> {
    // console.log("mounted;");
    // console.log(this.post);
    // console.log();
    const idx = parseInt(this.$route.params.idx);
    if (idx) {
      this.post.idx = idx;
      await this.loadAdvertisement();
    } else {
      this.post.categoryId = "advertisement";
    }

    this.beginAtMin = this.today;
    // console.log("this.beginAtMin;", this.beginAtMin);
    this.isMounted = true;
  }

  get today(): string {
    return dayjs().format("YYYY-MM-DD");
  }

  /**
   * Advertisement settings getter.
   * @returns AdvertisementSettings from store state.
   */
  get settings(): AdvertisementSettings {
    return store.state.advertisementSettings;
  }

  /**
   * Country data list getter.
   * @returns ResponseData - gets country list from store state.
   */
  get countries(): ResponseData {
    return store.state.countries;
  }

  /**
   * @returns ResponseData - If a user selected a country for advertisement,
   * it will return the corresponding point listing for each banner type for that country.
   * If the user did not choose or the selected country doesn't have data, it will return the "default" listing.
   */
  get countryPointListing(): ResponseData {
    const c = this.post.countryCode;
    if (!this.settings.point) return {};
    const listing = this.settings.point[c];
    if (!listing || listing == undefined) return this.settings.point["default"];
    return listing;
  }

  /**
   * Total price in point calculation.
   *
   * @returns number - returns the total point required to create the advertisement.
   */
  get priceInPoint(): number {
    if (!this.settings) return 0;
    if (!this.noOfDays) return 0;
    return this.countryPointListing[this.post.code] * this.noOfDays;
  }

  /**
   * @returns string - returns the minimum selectable date for the "endAt" input.
   */
  get endAtMin(): string {
    let d = new Date();
    if (this.post.beginDate) d = new Date(this.post.beginDate);

    return dayjs(d).format("YYYY-MM-DD");
  }

  /**
   * @returns string - returns the maximum selectable date for the "beginAt" input.
   */
  get beginAtMax(): string {
    if (this.post.endDate) return dayjs(this.post.endDate).format("YYYY-MM-DD");
    return "";
  }

  /**
   * @returns number - returns the total range of days the user selected from beginAt to endAt dates.
   */
  get noOfDays(): number {
    return daysBetween(this.post.beginDate, this.post.endDate) + 1;
  }

  /**
   * @returns number - returns the total number left for the advertisement to be served.
   * If it is not begun yet, it will return the `noOfDays` the advertisement will be served.
   */
  get servingDaysLeft(): number {
    if (!this.isRefundable) return this.noOfDays;
    else return daysBetween(this.today, this.post.endDate);
  }

  /**
   * @returns boolean - it returns wether or not the user's point is insufficient to create an advertisement.
   */
  get isPointInsufficient(): boolean {
    if (!this.api.user) return true;
    if (this.api.user.point == 0) return true;
    return this.api.user.point < this.priceInPoint;
  }

  /**
   * @returns boolean - Returns wether the advertisement can be refunded or not.
   * If the Advertisement is saved but has begun to be served, it will return true.
   * If it is not begun yet, it will return false.
   */
  get isRefundable(): boolean {
    if (dayjs().isSame(this.post.beginDate, "day")) return true;
    return dayjs().isAfter(this.post.beginDate, "day");
  }

  get isCancellable(): boolean {
    return dayjs().isBefore(this.post.beginDate, "day");
  }

  get refundablePoints(): number {
    if (this.servingDaysLeft < 0) return 0;
    return this.servingDaysLeft * this.countryPointListing[this.post.code];
  }

  async loadAdvertisement(): Promise<void> {
    try {
      this.post = await this.api.postGet({ idx: this.post.idx });
      // console.log("advertisement: ", this.post);
    } catch (e) {
      this.api.error(e);
    }
  }

  async onSubmit(): Promise<void> {
    let isCreate = true;
    if (this.post.idx) isCreate = false;
    try {
      this.post = await this.api.postEdit(this.post.toJson);
      if (isCreate) {
        ApiService.instance.open(`/advertisement/edit/${this.post.idx}`);
      } else {
        this.api.openToast(
          "Updated",
          "Advertisement successfully updated!",
          "b-toaster-bottom-center",
          "success",
          true
        );
      }
    } catch (e) {
      this.api.error(e);
    }
  }

  /**
   * Starts the advertisement.
   */
  async onAdvertisementStart(): Promise<void> {
    try {
      this.post = await this.api.advertisementStart(this.post.toJson);
      store.commit("refreshProfile");
    } catch (e) {
      this.api.error(e);
    }
  }

  async onAdvertisementStop(): Promise<void> {
    const conf = await this.api.confirm(
      "Confirm",
      "Are you sure you want to cancel the advertisement?"
    );
    if (!conf) return;
    try {
      this.post = await this.api.advertisementStop(this.post.idx);
      store.commit("refreshProfile");
    } catch (e) {
      this.api.error(e);
    }
  }

  async onClickDelete(): Promise<void> {
    const conf = await this.api.confirm(
      "Confirm",
      "Are you sure you want to delete the advertisement?"
    );
    if (!conf) return;
    try {
      this.post = await this.api.postDelete(this.post.idx);
      store.state.router.push("/advertisement");
    } catch (e) {
      this.api.error(e);
    }
  }

  onFileUpload(file: FileModel): void {
    this.post.fileIdxes = addByComma(this.post.fileIdxes, file.idx);
  }
}
</script>
