<template>
  <div>
    <h4>Admin Settings</h4>

    <div class="mt-2 alert alert-warning">
      Admin settings are <b>optional</b>. If you create the option, then the option can affect the app. Please read
      README.md of `matrix`.
    </div>

    <div class="mt-2 alert alert-info">
      <h4>Pre-defined codes</h4>
      <pre-defined
        code="admins"
        :data="settings"
        label="Admins"
        description="Add admins. You can add more than one email address separating by comma(,)."
        @update="onChildUpdate"
      ></pre-defined>
      <pre-defined
        code="searchCategories"
        :data="settings"
        label="Search Categories"
        description="If set, only categories specified here can be searched. You can add more than one categories separating by comma(,)."
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        code="termsAndConditions"
        :data="settings"
        label="Terms and Conditions"
        rows="2"
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        code="privacyPolicy"
        :data="settings"
        label="Privacy Policy"
        rows="2"
        @update="onChildUpdate"
      ></pre-defined>
      <hr />

      <h3>Reigster and login</h3>

      <pre-defined
        type="number"
        code="register"
        :data="settings"
        label="Register point"
        description="The point that user will get on register. It must be 0 or bigger than 0."
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        type="number"
        code="login"
        :data="settings"
        label="Login point"
        description="The point that user will get on every login. It must be 0 or bigger than 0."
        @update="onChildUpdate"
      ></pre-defined>

      <hr />
      <h3>Like and dislike</h3>
      <pre-defined
        code="enableLike"
        :data="settings"
        label="Enable like button"
        type="switch"
        description="Turn on this switch to show like button on screen."
        @update="onChildUpdate"
      ></pre-defined>
      <pre-defined
        code="enableDislike"
        :data="settings"
        label="Enable dislike button"
        type="switch"
        description="Turn on this switch to show dislike button on screen."
        @update="onChildUpdate"
      ></pre-defined>
      <pre-defined
        type="number"
        code="like"
        :data="settings"
        label="Like point"
        description="0 or bigger than 0. The point to be given to whom received the 'like'."
        @update="onChildUpdate"
      ></pre-defined>
      <pre-defined
        type="number"
        code="likeDeduction"
        :data="settings"
        label="Like deduction point"
        description="The point to be increased or descrased for the user who pressed like button."
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        type="number"
        code="dislike"
        :data="settings"
        label="Dislike point"
        description="0 or less than 0. The point to be given to whom received the 'dislike'."
        @update="onChildUpdate"
      ></pre-defined>
      <pre-defined
        type="number"
        code="dislikeDeduction"
        :data="settings"
        label="Dislike deduction point"
        description="The point to be increased or descrased for the user who pressed like button."
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        type="number"
        code="voteDailyLimitCount"
        :data="settings"
        label="Vote daily limit count"
        description="The number of limit that increase or decrease point when user votes. User can continue voting even after this limit, but point will not be changed."
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        type="number"
        code="voteHourlyLimit"
        :data="settings"
        label="Vote hourly limit"
        description="The hours to limit with 'Vote hourly limit count'."
        @update="onChildUpdate"
      ></pre-defined>

      <pre-defined
        type="number"
        code="voteHourlyLimitCount"
        :data="settings"
        label="Vote hourly limit Count"
        description="The number of limit count to vote within the hours of 'Vote hourly limit'."
        @update="onChildUpdate"
      ></pre-defined>
    </div>

    <div class="alert alert-secondary">
      <h4>Dynamic admin settings</h4>
      <small class=""
        >You can create, update, delete custom settings. You can create custom settings for the need of the client
        app.</small
      >
      <form @submit.prevent="onCreate">
        <div class="row">
          <div class="col">
            <div class="form-group">
              <input class="form-control" placeholder="Admin setting code(key)" v-model="form.code" />
            </div>
          </div>
          <div class="col">
            <div class="form-group">
              <textarea class="form-control" rows="1" placeholder="Data(value)" v-model="form.data"></textarea>
            </div>
          </div>
          <div class="col">
            <button class="btn btn-primary">Create</button>
          </div>
        </div>
      </form>

      <hr />

      <section>
        <div v-for="code in codes" :key="code">
          <form @submit.prevent="onUpdate(code)">
            <div class="row">
              <div class="col">
                {{ code }}
              </div>
              <div class="col">
                <div class="form-group">
                  <textarea class="form-control" rows="1" v-model="settings[code]"></textarea>
                </div>
              </div>
              <div class="col">
                <button class="btn btn-primary">Update</button>
                <button type="button" class="ml-2 btn btn-danger" @click="onDelete(code)">Delete</button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import PreDefined from "./AdminSettingPreDefined.vue";
@Component({
  components: { PreDefined },
})
export default class AdminSettings extends Vue {
  api = ApiService.instance;
  cs = ComponentService.instance;
  hiddenCodes: string[] = [
    "admins",
    "advertisementCategories",
    "dislike",
    "dislikeDeduction",
    "enableDislike",
    "enableLike",
    "like",
    "likeDeduction",
    "login",
    "maximumAdvertisementDays",
    "privacyPolicy",
    "register",
    "searchCategories",
    "termsAndConditions",
    "voteDailyLimitCount",
    "voteHourlyLimit",
    "voteHourlyLimitCount",
  ];
  form = {
    code: "",
    data: "",
  };
  settings: { [index: string]: string | number } = {};
  async mounted(): Promise<void> {
    try {
      this.settings = await this.api.settings();
      this.settings = Object.assign({}, this.settings);
    } catch (e) {
      this.cs.error(e);
    }
  }
  get codes(): string[] {
    const keys = Object.keys(this.settings).filter((v) => !this.hiddenCodes.includes(v));
    // console.log(keys);
    return keys;
  }
  async onCreate(): Promise<void> {
    if (typeof this.settings[this.form.code] !== "undefined") {
      return this.cs.alert("Admin settings", "The code is already exsist.");
    }
    try {
      await this.api.setConfig(this.form.code, this.form.data);
      await this.cs.alert("Admin settings", `${this.form.code} has been created.`);
      this.settings = Object.assign({}, this.settings, {
        [this.form.code]: this.form.data,
      });
      this.form.code = "";
      this.form.data = "";
    } catch (e) {
      this.cs.error(e);
    }
  }
  async onUpdate(code: string): Promise<void> {
    try {
      await this.api.setConfig(code, this.settings[code]);
      this.cs.alert("Admin settings", `${code} has been updated.`);
    } catch (e) {
      this.cs.error(e);
    }
  }
  onChildUpdate(code: string, data: string): void {
    this.settings[code] = data;
    this.onUpdate(code);
  }
  async onDelete(code: string): Promise<void> {
    try {
      const re = await this.cs.confirm("Admin settings", `Do you want to delete the ${code} settigns?`);
      if (re === false) return;
      await this.api.deleteConfig(code);
      await this.cs.alert("Admin settings", `${code} has been deleted.`);
      delete this.settings[code];
      this.settings = Object.assign({}, this.settings);
    } catch (e) {
      this.cs.error(e);
    }
  }
}
</script>
