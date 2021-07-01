<template>
  <section class="currency-converter" v-if="Object.keys(currencies).length">
    <div class="text-center">{{ "currency_converter" | t }}</div>
    <form @submit.prevent="onSubmit">
      <div class="d-flex text-center mb-2">
        <div class="w-100 mr-2">
          <div>{{ "from" | t }}</div>
          <b-form-select
            v-model="fromCode"
            :options="currencies.selectOptions"
            @change="onSubmit()"
          ></b-form-select>
        </div>

        <div class="w-100">
          <div>{{ "to" | t }}</div>
          <b-form-select
            v-model="toCode"
            :options="currencies.selectOptions"
            @change="onSubmit()"
          ></b-form-select>
        </div>
      </div>

      <div class="d-flex text-center mb-2">
        <div role="group" class="mr-2">
          <label for="amount">{{ "amount" | t }}</label>
          <b-form-input
            id="amount"
            v-model="amount"
            :placeholder="'amount' | t"
            @keyup="onCompute(first)"
          ></b-form-input>
        </div>
        <div>
          <label for="converted">{{ "converted" | t }}</label>
          <b-form-input
            id="converted"
            v-model="convertedAmount"
            :placeholder="'converted' | t"
            @keyup="onCompute(second)"
          ></b-form-input>
        </div>
      </div>
      <div class="d-flex justify-content-between">
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
import { CountryCurrenciesModel } from "@/x-vue/services/interfaces";
import Service from "@/x-vue/services/x-vue.service";

import { Vue, Prop, Component } from "vue-property-decorator";

/**
 * Usage by default the `from` is 'USD' and `to` is 'KRW'
 * 
 *  
    <currency-converter
      from="USD"
      to="PHP"
      @error="app.error($event)"
    ></currency-converter>
 */
@Component({})
export default class CurrencyConverter extends Vue {
  currencies: CountryCurrenciesModel = new CountryCurrenciesModel();
  @Prop({ default: "USD" }) from!: string;
  @Prop({ default: "KRW" }) to!: string;
  amount = "1";
  convertedAmount = "0";

  fromCode = "";
  toCode = "";

  // get first convertion pattern
  get first(): string {
    return `${this.fromCode}_${this.toCode}`;
  }

  // get the reverse conversion pattern
  get second(): string {
    return `${this.toCode}_${this.fromCode}`;
  }

  rate: { [index: string]: number } = {};

  // get country currencies and display to select options
  async mounted(): Promise<void> {
    this.fromCode = this.from;
    this.toCode = this.to;
    try {
      this.currencies = await ApiService.instance.getCountryCurrencies();
      this.onSubmit();
    } catch (e) {
      Service.instance.error(e);
    }
  }

  // get exchange rate base from currency then compute current amount to converted amount
  async onSubmit(): Promise<void> {
    if (this.fromCode == this.toCode) return;
    try {
      this.rate = await ApiService.instance.getExchangeRate({
        currency1: this.fromCode,
        currency2: this.toCode,
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
      this.convertedAmount =
        "" + (this.rate[exchange] * parseInt(this.amount)).toFixed(2);
    } else {
      this.amount =
        "" + (this.rate[exchange] * parseInt(this.convertedAmount)).toFixed(2);
    }
  }

  // switch the currency position
  onSwitch(): void {
    const temp = this.fromCode;
    this.fromCode = this.toCode;
    this.toCode = temp;
    this.onCompute(this.first);
  }
}
</script>
