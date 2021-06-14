<template>
  <div>
    <section class="upload-image">
      <div class="uploaded-image d-inline-block" style="position: relative">
        <img class="w-100" :src="file.url" v-if="file.url" />
        <div
          class="close-button"
          @click="onClickDeleteImage"
          v-if="file.idx"
          style="
            position: absolute;
            display: flex;
            width: 24px;
            align-items: center;
            justify-content: center;
            bottom: 6px;
            right: 6px;
            height: 24px;
            background-color: red;
            color: white;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
          "
        >
          <div>&#x00D7;</div>
        </div>
      </div>
      <div class="upload-button">
        <input type="file" @change="onFileChangeImage($event, 'banner')" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { FileModel } from "@/x-vue/services/interfaces";
import FileDisplay from "@/x-vue/components/forum/FileDisplay.vue";
import { ApiService } from "@/x-vue/services/api.service";
import { AppService } from "@/service/app.service";

@Component({
  props: ["taxonomy", "entity", "code"],
  components: {
    FileDisplay,
  },
})
export default class UploadImage extends Vue {
  taxonomy!: string;
  entity!: number;
  code!: string;
  percent = 0;
  file: FileModel = {} as FileModel;
  confirmDelete = "Do you want to delete?";
  api: ApiService = ApiService.instance;
  app: AppService = AppService.instance;
  async mounted(): Promise<void> {
    console.log("UploadImage mounted");
    try {
      if (this.entity) {
        this.file = await this.api.fileGet({
          taxonomy: this.taxonomy,
          entity: this.entity,
          code: this.code,
        });
      } else {
        // todo Delete taxonomy=... entity=0 & code=... by creating fileDelete with taxonom & entity
        // await this.api.fileDelete(this.taxonomy, this.entity);
      }
    } catch (e) {
      if (e !== "error_entity_not_found") {
        AppService.instance.error(e);
      }
    }
  }

  // Delete previously uploaded image
  // 이전에 업로드된 사진이 있는가?
  // 그렇다면, 이전 업로드된 파일이 쓰레기로 남지 않도록 삭제한다.
  async deleteImage(): Promise<void> {
    if (!this.file.idx) return;
    try {
      const idx = await this.api.fileDelete(this.file.idx);
      this.$emit("deleted", this.file.idx);
      this.file = {} as FileModel;
    } catch (e) {
      this.app.error(e);
    }
  }
  onClickDeleteImage(): void {
    const re = confirm(this.confirmDelete);
    if (re) {
      this.deleteImage();
    }
  }

  async onFileChangeImage(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files as FileList;
    if (files.length === 0) {
      console.log("User cancelled upload");
      return;
    }
    const file = files[0];

    this.deleteImage();

    // upload new image
    // 새로운 사진을 업로드한다.
    try {
      this.file = await this.api.fileUpload(
        file,
        {
          taxonomy: this.taxonomy,
          entity: this.entity,
          code: this.code,
        },
        (p: number) => {
          this.percent = p;
        }
      );

      this.$emit("uploaded", this.file);
    } catch (e) {
      this.app.error(e);
    }
  }
}
</script>
