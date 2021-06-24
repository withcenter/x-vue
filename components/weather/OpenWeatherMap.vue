<template>
  <section>
    {{ weather }}
    <!-- <h5 class="mb-0">
      {{ weather.city }}, {{ weather.twoDigitCode }}
      {{ Math.round(weather.current.main.temp) }}℃
      <img
        :src="
          'https://openweathermap.org/img/wn/' +
          weather.current.weather[0].icon +
          '.png'
        "
      />
    </h5>
    <div>Feels like {{ weather.current.main.feels_like }} ℃.</div>
    <div class="text-capitalize">
      {{ weather.current.weather[0].description }}
    </div>
    <div>Humidity: {{ weather.current.main.humidity }}%</div>
    <div>
      Min {{ Math.round($current.main.temp_min) }} ℃. - Max
      {{ Math.round($current.main.temp_max) }} ℃.
    </div> -->
  </section>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { ResponseData } from "@/x-vue/services/interfaces";
import Vue from "vue";
export default class OpenWeatherMap extends Vue {
  weather: ResponseData = {};

  async mounted(): Promise<void> {
    console.log("OpenWeatherMap##############");
    try {
      this.weather = await ApiService.instance.openWeatherMap();
    } catch (e) {
      ApiService.instance.error(e);
    }
  }
}
</script>
