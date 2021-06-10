<template>
  <div v-if="settings">
    <form @submit.prevent="onSubmit">
      <div>
        @todo If there is no advertisement, guide the user how to create first
        advertisement esialy.
      </div>

      <div class="box">
        <div v-if="!post.files.length">No banner chosen ..</div>
        <file-display :files="post.files" :showDelete="true"></file-display>
      </div>
      <upload-button
        class="mt-2"
        @success="onFileUploaded"
        @progress="uploadProgress = $event"
      ></upload-button>

      <div class="form-group">
        <label>Name</label>
        <input
          class="mt-3 form-control"
          placeholder="Name"
          type="text"
          v-model="post.name"
        />
        <small class="form-text text-muted"
          >Input name of the advertisement</small
        >
      </div>

      <div class="form-group">
        <label>Contact No.</label>
        <input
          class="mt-3 form-control"
          placeholder="Contact number"
          type="text"
          v-model="post.phoneNo"
        />
        <small class="form-text text-muted"> Input your phone number. </small>
      </div>

      <div class="form-group">
        <label>Banner Type/Position</label>
        <select class="form-control" v-model="post.code">
          <option value="" disabled selected>Select Type</option>
          <option v-for="type in settings.types" :key="type">
            {{ type }}
          </option>
        </select>
        <small class="form-text text-muted">
          Select where you want to display your banner.
        </small>
      </div>

      <div class="form-group">
        <label>Category(or global)</label>
        <select class="form-control" v-model="post.subcategory">
          <option value="" disabled selected>Select category or global</option>
          <option v-for="category in settings.categories" :key="category">
            {{ category }}
          </option>
        </select>
        <small class="form-text text-muted">
          Select where you want to display your banner. @todo: add property to
          PostModel for banner placement.
        </small>
      </div>

      <div class="form-group" v-if="countries">
        <label>Cafe Country</label>
        <select class="form-control" v-model="post.countryCode">
          <option value="default" disabled selected>Select Country</option>
          <option v-for="(value, name) in countries" :key="name" :value="name">
            {{ value }}
          </option>
        </select>
        <small class="form-text text-muted">
          Select the country. 어느 국가의 교민 카페들에게 광고 표시를 할지
          선택해 주세요.
        </small>
      </div>

      @todo display point per day after user input banner type, place, cafe
      country.

      <div class="form-group bg-light p-3">
        <label>{{ "advertisement_begin_end_date" | t }}</label>
        <div>
          <input
            v-model="post.beginAt"
            type="date"
            name="beginAt"
            :min="beginAtMin"
            :max="beginAtMax"
          />
          <input
            v-model="post.endAt"
            type="date"
            name="endAt"
            :min="endAtMin"
          />
        </div>

        <small class="form-text text-muted">
          {{ "advertisement_serving_days" | t }}: ?? {{ "days" | t }}
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
        Point {{ priceInPoint }} xxx.xxx.xxx
        <div class="text-danger" v-if="isPointInsufficient">
          Insufficient point! You don't have enough point for this kind of
          advertisement.
        </div>
      </div>

      [/] @todo when user change dates, display the price (point).<br />
      @todo If the user is lack of point, display warning.<br />
      @todo When the user press save button, deduct the point from user. And the
      date is no loger changable.<br />

      @todo After save, display one of "cancel" or "refund" button.<br />
      @todo after cancel or refund, display "resume the advertisement" or
      "delete" button.<br />

      <button
        class="btn btn-outline-primary"
        type="submit"
        :disabled="!isPointInsufficient"
      >
        Save the advertisement
      </button>

      <hr />

      <div class="box">
        <span class="p-2"> Point Listing: {{ post.countryCode }} </span>
        <table class="w-100 table table-striped">
          <thead>
            <tr class="table-header">
              <th scope="col">Banner Type</th>
              <th scope="col">Point</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(value, name) in pointList[post.countryCode]"
              :key="name"
            >
              <td>{{ name }}</td>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
        <small class="text-info">
          Note: Banner type points may vary depending on the chosen country.
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
      <br />@todo Cancel button will be shown if the banner has not begin
      yet.<br />
      @todo Refund button will be shown if the banner has begun.<br />
      @todo Delete button will be shown if the banner has no point. Meaning 1)
      the user may not have paid the point yet. 2) the banner was cancelled, or
      refunded. In which case, the banner can be deleted without point refund
      computation, then "delete button" will be displayed.
    </form>
    {{ noOfDays }}
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
import { dateRange } from "@/x-vue/services/functions";

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

  now = new Date();
  beginAtMin = "";

  get settings(): AdvertisementSettings {
    return this.$store.state.advertisementSettings;
  }

  get countries(): ResponseData {
    return this.$store.state.countries;
  }

  get pointList(): ResponseData {
    return this.$store.state.advertisementSettings.point;
  }

  get priceInPoint(): number {
    if (!this.settings) return 0;
    if (!this.post.code) return 0;
    if (!this.noOfDays) return 0;

    return (
      this.pointList[this.post.countryCode][this.post.code] * this.noOfDays
    );
  }

  get endAtMin(): string {
    if (this.post.beginAt) {
      const d = new Date(this.post.beginAt);
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    } else {
      return "";
    }
  }

  get beginAtMax(): string {
    if (this.post.endAt) {
      const d = new Date(this.post.endAt);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    } else {
      return "";
    }
  }

  get noOfDays(): number {
    if (!this.post.beginAt) return 0;
    if (!this.post.endAt) return 0;
    return dateRange(new Date(this.post.beginAt), new Date(this.post.endAt));
  }

  get isPointInsufficient(): boolean {
    if (!this.api.user) return false;
    if (this.api.user.point == 0) return false;
    return this.api.user.point < this.priceInPoint;
  }

  mounted(): void {
    console.log("mounted");
    this.post.countryCode = "default";
    this.post.categoryId = "advertisement";

    this.beginAtMin = this.now.toISOString().split("T")[0];
    // console.log(this.post.toJson);
  }

  async onSubmit(): Promise<void> {
    // console.log(this.post);
    console.log(this.post.toJson);
    // try {
    // this.api.postEdit(this.post.toJson);
    // } catch (e) {
    //   this.api.error(e);
    // }
  }

  onFileUploaded(file: FileModel): void {
    this.post.files.push(file);
    this.uploadProgress = 0;
  }
}
</script>
