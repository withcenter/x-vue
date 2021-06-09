<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>
        @todo If there is no advertisement, guide the user how to create first
        advertisement esialy.
      </div>

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
        <label>Banner Type</label>
        <input
          class="mt-3 form-control"
          placeholder="Select banner type"
          type="text"
          v-model="post.code"
        />
        <small class="form-text text-muted">
          Select where you want to display your banner.
        </small>
      </div>

      <div class="form-group">
        <label>Banner Place</label>
        <input
          class="mt-3 form-control"
          placeholder="Select banner type"
          type="text"
          v-model="post.code"
        />
        <small class="form-text text-muted">
          Select where you want to display your banner.
        </small>
      </div>

      <div class="form-group">
        <label>Cafe Country</label>
        <input
          class="mt-3 form-control"
          placeholder="Select banner type"
          type="text"
          v-model="post.code"
        />
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
          <input type="date" name="beginAt" value="" />
          <input type="date" name="endAt" value="" />
        </div>

        <small class="form-text text-muted">남은 광고 일 수: ??</small>
        <small class="form-text text-muted"
          >광고비 시작 날짜와 끝 날짜를 선택해주세요.</small
        >
        <small class="form-text text-muted"
          >참고: 날짜 입력은 직접 입력하지 않고, Input 태그의 달력에서 날짜를
          선택한다. type=date 의 표시는 YYYY/MM/DD 이지만, PHP 로 전달은
          YYYY-MM-DD 이다.</small
        >
        <small class="form-text text-muted"
          >참고: 광고가 23일 까지이면, 밤 23일까지 표시된다. 즉, 광고가 0일
          남아도, 마지막 날 밤까지 광고가 표시된다.</small
        >
      </div>

      <div class="form-group">
        <label>Advertisement Period</label>
        <input
          class="mt-3 form-control"
          placeholder="Select banner type"
          type="text"
          v-model="post.code"
        />
        <small class="form-text text-muted">
          Select from date and end date. from date must be within 12 days.
        </small>
      </div>

      <button class="btn btn-link" type="submit">Save</button>

      <hr />

      @todo banner price computation. The price list is comming from the admin
      settings. and the price is difference based on country and banner
      place.<br />
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { AdvertisementSettings, PostModel } from "@/x-vue/services/interfaces";

@Component({})
export default class Advertisement extends Vue {
  post = new PostModel();

  get settings(): AdvertisementSettings {
    return this.$store.state.advertisementSettings;
  }

  mounted(): void {
    console.log("mounted");
  }
  onSubmit(): void {
    console.log(this.post);
    console.log(this.post.toJson);
  }
}
</script>
