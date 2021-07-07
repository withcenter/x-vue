<template>
  <section class="weather" v-if="weather.name">
    <div class="fs-xl text-center">
      <span> {{ weather.name }},</span>
      <span>{{ weather.sys.country }}</span>
    </div>
    <div class="d-flex">
      <div class="d-flex justify-content-between">
        <img :src="'https://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'" />

        <div class="fs-xxl mt-2">{{ Math.round(weather.main.temp) }}<span class="fs-xxs valign-super">℃</span></div>
        <div class="mt-4 pl-3">
          <div>L {{ Math.round(weather.main.temp_min) }}<span class="fs-xs valign-super">℃</span></div>
          <div>H {{ Math.round(weather.main.temp_max) }}<span class="fs-xs valign-super">℃</span></div>
        </div>
      </div>
    </div>

    <div class="text-capitalize">
      {{ weather.weather[0].description }}
    </div>
    <div class="d-flex flex-wrap justify-content-between fs-xs">
      <div>{{ "humidity" | t }} {{ weather.main.humidity }}%</div>
      <div>{{ "wind" | t }} {{ weather.wind.speed }}km/h</div>
      <div>{{ "sunrise" | t }} {{ sunrise }}</div>
      <div>{{ "sunset" | t }} {{ sunset }}</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.fs-xxs {
  font-size: 0.5em;
}
.valign-super {
  vertical-align: super;
}
</style>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { ResponseData } from "@/x-vue/interfaces/interfaces";
import Service from "@/x-vue/services/component.service";
import dayjs from "dayjs";
import Vue from "vue";

import Component from "vue-class-component";

@Component({})
export default class OpenWeatherMap extends Vue {
  weather: ResponseData = {};

  get sunrise(): string {
    if (!this.weather.sys) return "";
    return dayjs(this.weather.sys.sunrise * 1000).format("h:ma");
  }

  get sunset(): string {
    if (!this.weather.sys) return "";
    return dayjs(this.weather.sys.sunset * 1000).format("h:ma");
  }

  async mounted(): Promise<void> {
    try {
      this.weather = await ApiService.instance.openWeatherMap();
    } catch (e) {
      Service.instance.error(e);
    }
  }
}
</script>
