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
import { AppService } from "@/service/app.service";
import { FileModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

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

  app = AppService.instance;

  mounted(): void {
    if (this.size) this.defaultSize = this.size;
  }

  onFileChange(event: HTMLInputEvent): void {
    if (this.app.notLoggedIn) {
      this.app.error("error_login_first");
      return;
    }

    if (event.target.files === null || event.target?.files?.length === 0) {
      // console.log("User cancelled upload");
      return;
    }
    const file = event.target.files[0];
    // this.app.api.fileUpload(
    //   file,
    //   {},
    //   this.onUploaded,
    //   this.app.error,
    //   this.onProgress
    // );
  }

  onUploaded(file: FileModel): void {
    // console.log(file);
    this.$emit("success", file);
  }

  onProgress(progress: number): void {
    // console.log(progress);
    this.$emit("progress", progress);
  }
}
</script>
