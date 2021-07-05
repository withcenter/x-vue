<template>
  <div class="mt-3">
    <label>{{ label }}</label>

    <div v-if="type == 'textarea' || type == 'number'">
      <div class="d-flex">
        <textarea class="form-control" :rows="rows" v-model="v" v-if="type == 'textarea'"></textarea>
        <input class="form-control" type="number" v-model="v" v-if="type == 'number'" />
        <button class="ml-2 btn btn-primary" @click="$emit('update', code, v)">Update</button>
      </div>
      <small class="form-text">{{ description }}</small>
    </div>

    <b-form-checkbox v-model="checked" name="check-button" @change="onChange" switch v-if="type == 'switch'">
      {{ description }}
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class AdminSettingsPreDefined extends Vue {
  @Prop() code!: string;
  @Prop({ default: {} }) data!: { [key: string]: string };
  @Prop({ default: "Label" }) label!: string;
  @Prop({ default: "" }) description!: string;
  @Prop({ default: "textarea" }) type!: string;
  @Prop({ default: "1" }) rows!: number;
  v: string = this.data[this.code] ?? "";

  checked: boolean = this.v == "Y";
  onChange(checked: boolean): void {
    if (checked) this.v = "Y";
    else this.v = "N";
    this.$emit("update", this.code, this.v);
  }
}
</script>
