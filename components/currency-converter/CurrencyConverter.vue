<template>
  <section class="currency-converter" v-if="Object.keys(currencies).length">
    <div class="text-center">{{ "currency_converter" | t }}</div>
    <form @submit.prevent="onSubmit">
      <div class="d-flex text-center mb-2">
        <div class="w-100 mr-2">
          <div>From</div>
          <b-form-select
            v-model="from"
            :options="currencies.selectOptions"
            @change="onSubmit()"
          ></b-form-select>
        </div>

        <div class="w-100">
          <div>To</div>
          <b-form-select
            v-model="to"
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
import Vue from "vue";

import Component from "vue-class-component";

@Component({})
export default class CurrencyConverter extends Vue {
  currencies: CountryCurrenciesModel = new CountryCurrenciesModel();
  // from: string | null = null;
  // to: string | null = null;
  from: string | null = "USD";
  to: string | null = "PHP";
  amount = "1";
  convertedAmount = "0";

  get first(): string {
    return `${this.from}_${this.to}`;
  }
  get second(): string {
    return `${this.to}_${this.from}`;
  }
  rate: { [index: string]: number } = {};

  // get country currencies and display to select options
  async mounted(): Promise<void> {
    try {
      this.currencies = await ApiService.instance.getCountryCurrencies();
    } catch (e) {
      ApiService.instance.error(e);
    }
  }

  // get exchange rate base from currency then compute current amount to converted amount
  async onSubmit(): Promise<void> {
    console.log("onSubmit");
    try {
      this.rate = await ApiService.instance.getExchangeRate({
        currency1: this.from,
        currency2: this.to,
      });

      this.onCompute(this.first);
    } catch (e) {
      ApiService.instance.error(e);
    }
  }

  // compute currency from to
  onCompute(exchange: string): void {
    console.log("onCompute");
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
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
    this.onCompute(this.first);
  }
}
</script>
