<template>
  <section class="currency-converter" v-if="Object.keys(currencies).length">
    <form @submit.prevent="onSubmit">
      <div class="d-flex">
        <div class="w-100 mr-1">
          <b-form-select
            size="sm"
            v-model="fromCountry"
            :options="currencies.selectOptionsCountryName"
            @change="onSubmit()"
          ></b-form-select>
          <b-input-group size="sm" class="mt-1" :prepend="currency1Symbol">
            <b-form-input
              id="amount"
              v-model="amount"
              :placeholder="'amount' | t"
              @keyup="onCompute(first)"
            ></b-form-input>
          </b-input-group>
        </div>
        <button class="btn px-1" v-if="miniSwitchButton" @click="onSwitch">
          <ArrowLeftRightSvg></ArrowLeftRightSvg>
        </button>
        <div class="w-100 ml-1">
          <b-form-select
            size="sm"
            v-model="toCountry"
            :options="currencies.selectOptionsCountryName"
            @change="onSubmit()"
          ></b-form-select>

          <b-input-group size="sm" class="mt-1" :prepend="currency2Symbol">
            <b-form-input
              id="converted"
              v-model="convertedAmount"
              :placeholder="'converted' | t"
              @keyup="onCompute(second)"
            ></b-form-input>
          </b-input-group>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-1" v-if="buttons">
        <button class="btn btn-success">{{ "convert" | t }}</button>

        <button type="button" class="btn btn-info" @click="onSwitch">
          {{ "switch" | t }}
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import { CountryCurrenciesModel } from "@/x-vue/interfaces/interfaces";
import Service from "@/x-vue/services/component.service";

import { Vue, Prop, Component } from "vue-property-decorator";

import ArrowLeftRightSvg from "@/x-vue/svg/ArrowLeftRightSvg.vue";

/**
 * Usage by default the `from` is 'United States' and `to` is 'South Korea'
 * 
 *  
    <currency-converter
      from="United States"
      to="South Korea"
      @error="app.error($event)"
    ></currency-converter>
 */
@Component({
  components: {
    ArrowLeftRightSvg,
  },
})
export default class CurrencyConverter extends Vue {
  currencies: CountryCurrenciesModel = new CountryCurrenciesModel();
  @Prop({ default: "미국" }) from!: string;
  @Prop({ default: "대한민국" }) to!: string;
  @Prop({ default: false }) buttons!: boolean;
  @Prop({ default: false }) miniSwitchButton!: boolean;
  amount = "1";
  convertedAmount = "0";

  fromCountry = "";
  toCountry = "";

  rate: { [index: string]: number } = {};

  getCountryCode(country: string): string {
    return this.currencies.countryCurrency[country].currencyCode;
  }

  getCurrencySymbol(country: string): string {
    return this.currencies.countryCurrency[country]?.currencySymbol || "";
  }

  get currency1(): string {
    return this.getCountryCode(this.fromCountry);
  }

  get currency2(): string {
    return this.getCountryCode(this.toCountry);
  }

  get currency1Symbol(): string {
    return this.getCurrencySymbol(this.fromCountry);
  }

  get currency2Symbol(): string {
    return this.getCurrencySymbol(this.toCountry);
  }

  // get first convertion pattern
  get first(): string {
    return `${this.currency1}_${this.currency2}`;
  }

  // get the reverse conversion pattern
  get second(): string {
    return `${this.currency2}_${this.currency1}`;
  }

  // get country currencies and display to select options
  async mounted(): Promise<void> {
    this.fromCountry = this.from;
    this.toCountry = this.to;
    try {
      this.currencies = await ApiService.instance.getCountryCurrencies();
      // console.log("this.currencies);", this.currencies);
      this.onSubmit();
    } catch (e) {
      Service.instance.error(e);
    }
  }

  // get exchange rate base from currency then compute current amount to converted amount
  async onSubmit(): Promise<void> {
    if (this.fromCountry == this.toCountry) return;
    try {
      this.rate = await ApiService.instance.getExchangeRate({
        currency1: this.currency1,
        currency2: this.currency2,
      });
      this.onCompute(this.first);
    } catch (e) {
      Service.instance.error(e);
    }
  }

  // compute currency from to
  onCompute(exchange: string): void {
    if (!this.rate[exchange]) return;
    if (exchange == this.first) {
      this.convertedAmount = "" + (this.rate[exchange] * parseInt(this.amount)).toFixed(2);
    } else {
      this.amount = "" + (this.rate[exchange] * parseInt(this.convertedAmount)).toFixed(2);
    }
  }

  // switch the currency position
  onSwitch(): void {
    const temp = this.fromCountry;
    this.fromCountry = this.toCountry;
    this.toCountry = temp;
    this.onCompute(this.first);
  }
}
</script>
