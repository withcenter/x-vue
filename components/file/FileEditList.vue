<template>
  <div class="">
    <div class="row">
      <div
        class="position-relative p-1 col-3"
        v-for="file of files"
        :key="file.idx"
        style="height: 150px"
      >
        <FileEdit :file="file" @delete="onClickDelete"></FileEdit>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { FileModel } from "@/x-vue/services/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import Service from "@/x-vue/services/x-vue.service";
import FileEdit from "@/x-vue/components/file/FileEdit.vue";

@Component({
  components: { FileEdit },
})
export default class FileDisplay extends Vue {
  @Prop({ default: [] }) files!: Array<FileModel>;

  api = ApiService.instance;

  async onClickDelete(file: FileModel): Promise<void> {
    const conf = await Service.instance.confirm(
      "Title",
      "Are you sure you want to delete this file?"
    );
    if (!conf) return;

    try {
      await this.api.fileDelete(file.idx);
      this.$emit("deleted", file.idx);
    } catch (e) {
      Service.instance.error(e);
    }
  }
}
</script>
