<template>
  <div class="file-display grid">
    <div class="row">
      <div
        class="position-relative p-1 col-3"
        v-for="file of files"
        :key="file.idx"
        style="height: 150px"
      >
        <div
          class="icon-lg position-absolute m-2 bg-light circle-center pointer"
          v-if="showDelete"
          @click="onClickDelete(file.idx)"
        >
          <img class="icon-md" src="@/assets/svg/fas-trash.svg" />
        </div>
        <img class="w-100 h-100" :src="file.url" :alt="file.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { FileModel } from "@/x-vue/services/interfaces";
import { ApiService } from "@/x-vue/services/api.service";

@Component({
  props: ["files", "showDelete"],
})
export default class FileDisplay extends Vue {
  files!: Array<FileModel>;
  showDelete!: boolean;

  api = ApiService.instance;

  async onClickDelete(idx: string): Promise<void> {
    const conf = confirm("Are you sure you want to delete this file?");
    if (!conf) return;

    try {
      await this.api.fileDelete(idx);
      const index = this.files.findIndex((file) => file.idx == idx);
      this.files.splice(index, 1);
      this.$emit("file-deleted", idx);
    } catch (e) {
      // XHelper.instance.error(e);
      this.$emit("error", e);
    }
  }
}
</script>
