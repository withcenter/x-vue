<template>
  <section v-if="settings.SUPPORTED_LANGUAGES">
    <h2>Admin translations</h2>
    <div>supported languages: {{ settings.SUPPORTED_LANGUAGES }}</div>
    <div>
      <form @submit.prevent="onCreate">
        <div class="row">
          <div class="col">
            <input type="text" class="form-control mb-2" v-model="code" placeholder="언어 코드" />
          </div>

          <div class="col" v-for="ln in settings.SUPPORTED_LANGUAGES" :key="ln">
            <input type="text" class="form-control mb-2" v-model="createForm[ln]" :placeholder="ln" />
          </div>

          <div class="col">
            <button type="submit" class="btn btn-primary mb-2">Create</button>
          </div>
        </div>
      </form>
    </div>
    <div>
      {{ translations }}

      <table class="table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="code in Object.keys(translations)" :key="code">
            <th scope="row">
              <input type="text" class="form-control" v-model="translations[code]['code']" :placeholder="code" />
            </th>
            <td v-for="ln in settings.SUPPORTED_LANGUAGES" :key="ln">
              <input type="text" class="form-control" v-model="translations[code][ln]" />
            </td>
            <td>
              <b-button class="btn-sm btn-primary" @click="onUpdate(code)">Update</b-button>
              <b-button type="submit" class="ml-1 btn-sm btn-warning" @click="onDelete(code)">Delete</b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <section v-else>
    <b-spinner></b-spinner>
  </section>
</template>
<script lang="ts">
import { MapStringString, Settings, Translations } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  api = ApiService.instance;
  cs = ComponentService.instance;
  settings = {} as Settings;
  createForm = {} as MapStringString;
  translations = {} as Translations;
  code = "";
  mounted(): void {
    this.api.settings().then((settings) => (this.settings = settings));
    this.load();
  }
  async load(): Promise<void> {
    return this.api
      .loadTranslation()
      .then((translations) => {
        this.translations = translations;
      })
      .catch((e) => this.cs.error(e));
  }
  async onCreate(): Promise<void> {
    console.log("createForm; ", this.createForm);
    try {
      this.createForm["code"] = this.code;
      await this.api.editTranslation(this.createForm);
      await this.load();
      this.createForm = {};
      this.code = "";
    } catch (e) {
      this.cs.error(e);
    }
  }
  async onUpdate(currentCodeName: string): Promise<void> {
    try {
      const form = Object.assign({}, this.translations[currentCodeName]);
      form["currentCodeName"] = currentCodeName;
      if (!form["code"]) form["code"] = currentCodeName;
      await this.api.editTranslation(form);
      this.cs.alert("Translation updated", "Translation has been updated.");
    } catch (e) {
      console.log("error?");
      this.cs.error(e);
    }
  }
  async onDelete(code: string): Promise<void> {
    try {
      const re = confirm("정말 삭제하시겠습니까?");
      console.log("re; ", re);
      await this.api.deleteTranslation(code);
      this.load();
    } catch (e) {
      this.cs.error(e);
    }
  }
}
</script>
