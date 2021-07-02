<template>
  <div class="upload-button">
    <CameraSvg class="camera"></CameraSvg>
    <input type="file" @change="$emit('change', $event)" />
  </div>
</template>
<style lang="scss" scoped>
.upload-button {
  position: relative;
  overflow: hidden;
  cursor: pointer;

  .camera {
    width: 35px;
    height: 35px;
  }
  input {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    z-index: 1234;
    opacity: 0 !important;
    font-size: 2em;
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import CameraSvg from "@/x-vue/components/svg/CameraSvg.vue";

@Component({
  components: { CameraSvg },
})
export default class UploadButton extends Vue {}
</script>
