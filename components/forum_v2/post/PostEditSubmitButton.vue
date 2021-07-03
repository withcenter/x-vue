<template>
  <div>
    <button type="submit" class="btn btn-success" v-if="!loading">
      {{ "submit" | t }}
    </button>
    <b-spinner class="mx-2" type="grow" variant="success" v-if="loading"></b-spinner>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class PostEditSubmitButton extends Vue {
  @Prop({ default: false }) loading!: boolean;
}
</script>
