<template>
  <div>
    <UploadButton @change="onFileChange"></UploadButton>
  </div>
</template>
<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";
import Vue from "vue";
import Component from "vue-class-component";
import UploadButton from "@/x-vue/components/buttons/UploadButton.vue";

import { Prop } from "vue-property-decorator";

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  components: { UploadButton },
})
export default class UploadButtonBasic extends Vue {
  @Prop({ default: 35 }) size!: number;

  api = ApiService.instance;

  async onFileChange(event: HTMLInputEvent): Promise<void> {
    if (!this.api._user.loggedIn) {
      ComponentService.instance.error("error_login_first");
      return;
    }

    /// No file selection. Just return.
    if (event.target.files === null || event.target?.files?.length === 0) {
      return;
    }
    const file = event.target.files[0];

    console.log("file; ", file);
    try {
      const uploadedFile = await this.api.fileUpload(
        file,
        {
          taxonomy: "posts",
        },
        (progress) => this.$emit("progress", progress)
      );
      this.$emit("uploaded", uploadedFile);
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
