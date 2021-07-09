<template>
  <div class="text-center my-2" :class="['text-' + variant]">
    <b-spinner class="align-middle mr-2"></b-spinner>
    <strong>{{ "loading..." }}</strong>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Loading extends Vue {
  @Prop({ default: "success" }) variant!: string;
}
</script>
