<template>
  <div class="pr-2 position-relative overflow-hidden pointer">
    <img
      class="pointer"
      src="@/assets/svg/camera.svg"
      :style="{ width: `${defaultSize}px`, height: `${defaultSize}px` }"
    />
    <input
      class="h-100 top right position-absolute fs-lg opacity-0 pointer"
      type="file"
      @change="onFileChange"
    />
  </div>
</template>

<script lang="ts">
import { XFunctions } from "@/x-vue-helper/functions";
import Vue from "vue";
import Component from "vue-class-component";
import { ApiService } from "../services/api.service";

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  props: ["size"],
})
export default class UploadButton extends Vue {
  size!: number;

  /**
   * Icon default size
   */
  defaultSize = 35;

  api = ApiService.instance;

  mounted(): void {
    if (this.size) this.defaultSize = this.size;
  }

  async onFileChange(event: HTMLInputEvent): Promise<void> {
    if (this.api.notLoggedIn) {
      XFunctions.error("error_login_first");
      return;
    }

    if (event.target.files === null || event.target?.files?.length === 0) {
      // console.log("User cancelled upload");
      return;
    }
    const file = event.target.files[0];

    try {
      const res = await this.api.fileUpload(file, {}, this.onProgress);
      this.$emit("success", res);
    } catch (e) {
      XFunctions.error(e);
    }
  }

  onProgress(progress: number): void {
    // console.log(progress);
    this.$emit("progress", progress);
  }
}
</script>
