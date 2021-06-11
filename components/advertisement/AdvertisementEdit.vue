<template>
  <div v-if="settings">
    <form @submit.prevent="onSubmit">
      <div>
        @todo If there is no advertisement, guide the user how to create first
        advertisement esialy.
      </div>

      <div class="box d-flex mt-2">
        <upload-button
          :size="30"
          @success="onFileUploaded"
          @progress="uploadProgress = $event"
        ></upload-button>
        <div class="ml-3">
          <div class="p-1" v-if="!post.files.length">No banner chosen ..</div>
          <file-display :files="post.files" :showDelete="true"></file-display>
        </div>
      </div>

      <div class="form-group mt-2">
        <label>{{ "name" | t }}</label>
        <input
          class="form-control"
          placeholder="Name"
          type="text"
          v-model="post.name"
        />
        <small class="form-text text-muted">
          {{ "adv_name_hint" | t }}
        </small>
      </div>

      <div class="form-group mt-2">
        <label>{{ "contact_no" | t }}</label>
        <input
          class="form-control"
          placeholder="Contact number"
          type="text"
          v-model="post.phoneNo"
        />
        <small class="form-text text-muted">
          {{ "adv_contact_no_hint" | t }}
        </small>
      </div>

      <div class="form-group mt-2">
        <label>Category(or global)</label>
        <select class="form-control" v-model="post.subcategory">
          <option value="" disabled selected>
            Select category or global(default)
          </option>
          <option v-for="category in settings.categories" :key="category">
            {{ category }}
          </option>
        </select>
        <small class="form-text text-muted">
          Select which category you want to display your advertisement, if you
          don't choose category, it will default to global.
        </small>
      </div>

      <div class="form-group mt-2">
        <label>Banner Type/Position</label>
        <select
          class="form-control"
          v-model="post.code"
          :disabled="isNotEdittable"
        >
          <option value="" disabled selected>Select Type</option>
          <option v-for="type in settings.types" :key="type">
            {{ type }}
          </option>
        </select>
        <small class="form-text text-muted">
          Select where you want to display your banner.
        </small>
      </div>

      <div class="form-group mt-2" v-if="countries">
        <label>Cafe Country</label>
        <select
          value=""
          class="form-control"
          v-model="post.countryCode"
          :disabled="isNotEdittable"
        >
          <option disabled selected>Select Country</option>
          <option v-for="(value, name) in countries" :key="name" :value="name">
            {{ value }}
          </option>
        </select>
        <small class="form-text text-muted">
          Select the country. 어느 국가의 교민 카페들에게 광고 표시를 할지
          선택해 주세요.
        </small>
      </div>

      <div class="box" v-if="post.code && post.countryCode">
        Points Per Day: <b>{{ countryPointListing[post.code] }}</b> <br />
        <small class="text-info">
          Note: Point per day may vary depending on the banner type and chosen
          country.
        </small>
      </div>

      <div class="form-group bg-light p-3 mt-2">
        <label>{{ "advertisement_begin_end_date" | t }}</label>
        <div class="d-flex justify-content-between">
          <label
            >Begin Date
            <input
              v-model="post.beginDate"
              type="date"
              name="beginAt"
              :min="beginAtMin"
              :max="beginAtMax"
              :disabled="isNotEdittable"
            />
          </label>
          <label>
            End Date
            <input
              v-model="post.endDate"
              type="date"
              name="endAt"
              :min="endAtMin"
              :disabled="isNotEdittable"
            />
          </label>
        </div>

        <small class="form-text text-muted mb-2">
          {{ "advertisement_serving_days" | t }}: <b>{{ servingDaysLeft }}</b>
          {{ "days" | t }}
        </small>
        <small class="form-text text-muted mb-2">
          No of advertisement days: {{ noOfDays }}
        </small>
        <small class="form-text text-muted">
          광고비 시작 날짜와 끝 날짜를 선택해주세요.
        </small>
        <small class="form-text text-muted">
          참고: 날짜 입력은 직접 입력하지 않고, Input 태그의 달력에서 날짜를
          선택한다. type=date 의 표시는 YYYY/MM/DD 이지만, PHP 로 전달은
          YYYY-MM-DD 이다.
        </small>
        <small class="form-text text-muted">
          참고: 광고가 23일 까지이면, 밤 23일까지 표시된다. 즉, 광고가 0일
          남아도, 마지막 날 밤까지 광고가 표시된다.
        </small>
      </div>

      <!-- Total Advertisement price in points -->
      <div class="alert alert-info">
        Total Points required: <b v-if="priceInPoint">{{ priceInPoint }}</b>
        <br />
        <small class="text-danger" v-if="isPointInsufficient">
          Insufficient point! You don't have enough point to create this kind of
          advertisement. </small
        ><br />
        <small class="text-info">
          To get total points, points per day is multiplied to the total number
          of days beginning from "Begin date" to "End date".
        </small>
        <br />
        @todo when user change dates, display the price (point).<br />
        @todo If the user is lack of point, display warning.<br />
      </div>

      <div>
        <button
          class="w-100 btn btn-outline-primary"
          type="submit"
          :disabled="isPointInsufficient"
        >
          Save the advertisement
        </button>
        @todo After save, display one of "cancel" or "refund" button.<br />
        @todo When the user press save button, deduct the point from user. And
        the date is no loger changable.<br />
        @todo Delete button will be shown if the banner has no point. Meaning 1)
        the user may not have paid the point yet. 2) the banner was cancelled,
        or refunded. In which case, the banner can be deleted without point
        refund computation, then "delete button" will be displayed.
      </div>

      <div v-if="isNotEdittable">
        <button
          class="w-100 btn btn-outline-success"
          type="button"
          v-if="isRefundable"
          @click="onClickRefund"
        >
          Refund Remaining Days
        </button>
        <button
          class="w-100 btn btn-outline-danger"
          type="button"
          v-if="!isRefundable"
          @click="onClickCancel"
        >
          Cancel Advertisement
        </button>
        @todo Cancel button will be shown if the banner has not begin yet.<br />
        @todo Refund button will be shown if the banner has begun.<br />
        <hr />
      </div>

      <div v-if="isDeletable">
        <button
          class="w-100 mt-2 btn btn-outline-danger"
          type="button"
          @click="onClickDelete"
        >
          Delete Advertisement
        </button>
        @todo after cancel or refund, display "resume the advertisement" or
        "delete" button.
      </div>

      <div class="box">
        <p>
          Advertisement Points Listing:
          <span v-if="post.countryCode">{{ post.countryCode }}</span>
          <span v-if="!post.countryCode">Default</span> <br />
          <small class="text-info">
            Note: Points listing vary depending on the chosen country.
          </small>
        </p>
        <table class="w-100 mt-2 table table-striped">
          <thead>
            <tr class="table-header">
              <th scope="col">Banner Type</th>
              <th scope="col">Points(per day)</th>
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
          To get <b>Total Points Required</b> to create an advertisement,
          <b>Points Per Day</b> from chosen <b>Banner Type</b> is multiplied to
          the total number of days beginning from <b>"Begin date"</b> to
          <b>"End date"</b>.
        </small>
      </div>
      @todo banner price computation. The price list is comming from the admin
      settings. and the price is difference based on country and banner place.

      <br />
      @todo 무통장 입금 표시. 세금을 포함해서 계산한다.
      <hr />
      @todo 경고. 회원 활동으로 획득한 포인트를 광고에 이용 할 수 있습니다.
      하지만, 직접 활동하여 얻는 포인트(예, 포인트가 많은 다른 사용자의 계정으로
      광고 등록)하면, 광고 해지 및 포인트 0점 처리, 그리고 영구 차단이 되므로
      주의하시기 바랍니다.
    </form>
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
import UploadButton from "@/x-vue/components/UploadButton.vue";
import FileDisplay from "@/x-vue/components/forum/FileDisplay.vue";
import { ApiService } from "@/x-vue/services/api.service";
import {
  daysBetween,
  getStringDate,
  isFuture,
  isPast,
} from "@/x-vue/services/functions";
import store from "@/store";

@Component({
  components: {
    UploadButton,
    FileDisplay,
  },
})
export default class Advertisement extends Vue {
  api = ApiService.instance;

  post = new PostModel();

  uploadProgress = 0;

  beginAtMin = "";

  mounted(): void {
    // console.log("mounted;");
    // console.log(this.post);
    const idx = this.$route.params.idx;
    if (idx) {
      this.post.idx = idx;
      this.loadAdvertisement();
    } else {
      this.post.categoryId = "advertisement";
    }

    this.beginAtMin = getStringDate(this.now);
  }

  get now(): Date {
    return new Date();
  }
  get today(): string {
    const n = this.now;
    return n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate();
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

    if (!this.post.code) {
      return this.countryPointListing["default"] * this.noOfDays;
    }
    return this.countryPointListing[this.post.code] * this.noOfDays;
  }

  /**
   * @returns string - returns the minimum selectable date for the "endAt" input.
   */
  get endAtMin(): string {
    const d = this.post.beginDate ? new Date(this.post.beginDate) : this.now;
    d.setDate(d.getDate() + 1);
    return getStringDate(d);
  }

  /**
   * @returns string - returns the maximum selectable date for the "beginAt" input.
   */
  get beginAtMax(): string {
    if (!this.post.endDate) return "";
    return this.endAtMin;
  }

  /**
   * @returns number - returns the total range of days the user selected from beginAt to endAt dates.
   */
  get noOfDays(): number {
    return daysBetween(this.post.beginDate, this.post.endDate);
  }

  /**
   * @returns number - returns the total number left for the advertisement to be served.
   * If it is not begun yet, it will return the `noOfDays` the advertisement will be served.
   */
  get servingDaysLeft(): number {
    if (isFuture(this.post.beginDate)) return this.noOfDays;
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
   * @returns boolean - returns if some field for the Advertisement form is edittable.
   * Once the advertisement is created, it will be true, and some parts of the form will be either disabled or hidden.
   */
  get isNotEdittable(): boolean {
    return !!this.post.idx && !!this.post.beginAt && !!this.post.endAt;
  }

  /**
   * @returns boolean - Returns wether the advertisement can be refunded or not.
   * If the Advertisement is saved but has begun to be served, it will return true.
   * If it is not begun yet, it will return false.
   */
  get isRefundable(): boolean {
    return isPast(this.post.beginDate);
  }

  get isDeletable(): boolean {
    return !!this.post.idx && !this.post.beginAt && !this.post.endAt;
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
      const post = await this.api.advertisementEdit(this.post.toJson);
      if (isCreate) {
        store.commit("refreshProfile");
        ApiService.instance.open(`/advertisement/edit/${post.idx}`);
      }
    } catch (e) {
      this.api.error(e);
    }
  }

  async onClickCancel(): Promise<void> {
    // !TODO: why it's not working?
    // const conf = await this.api.confirm(
    //   "Are you sure you want to cancel the advertisement?",
    //   ""
    // );
    const conf = confirm("Are you sure you want to cancel the advertisement?");
    if (!conf) return;
    try {
      this.post = await this.api.advertisementCancel(this.post.idx);
      store.commit("refreshProfile");
    } catch (e) {
      this.api.error(e);
    }
  }

  async onClickRefund(): Promise<void> {
    // !TODO: why it's not working?
    // const conf = await this.api.confirm(
    //   "Are you sure you want to refund the advertisement?",
    //   ""
    // );
    const conf = confirm("Are you sure you want to refund the advertisement?");
    if (!conf) return;
    try {
      this.post = await this.api.advertisementRefund(this.post.idx);
      store.commit("refreshProfile");
    } catch (e) {
      this.api.error(e);
    }
  }

  async onClickDelete(): Promise<void> {
    // !TODO: why it's not working?
    // const conf = await this.api.confirm(
    //  "Are you sure you want to delete the advertisement?",
    //   ""
    // );
    const conf = confirm("Are you sure you want to delete the advertisement?");
    if (!conf) return;
    try {
      this.post = await this.api.advertisementDelete(this.post.idx);
      store.state.router.push("/advertisement");
    } catch (e) {
      this.api.error(e);
    }
  }

  onFileUploaded(file: FileModel): void {
    this.post.files.push(file);
    this.uploadProgress = 0;
  }
}
</script>
