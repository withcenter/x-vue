<template>
  <div>
    <section class="upload-image-linear" v-if="ui == 'linear'">
      <div class="uploaded-image d-inline-block" style="position: relative">
        <img class="w-100" :src="file.url" v-if="file.url" />
        <div class="close-button" @click="onClickDeleteImage" v-if="file.idx">
          <div>&#x00D7;</div>
        </div>
      </div>
      <div class="upload-button">
        <input type="file" @change="onFileChangeImage($event, 'banner')" />
      </div>
    </section>
    <section class="upload-image-circle" v-if="ui == 'circle'">
      <div class="base">
        <b-avatar :src="file.url" size="8rem" v-if="loading == false"></b-avatar>
        <CameraSvg class="camera"></CameraSvg>
        <input type="file" @change="onFileChangeImage($event, 'banner')" />
      </div>
      <div class="trash" @click="onClickDeleteImage" v-if="file.idx">
        <TrashSvg class="trash-icon"></TrashSvg>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
/**
 * 공용 위젯
 *
 * 이미 업로드 된 경우, [file] property 로 업로드된 파일을 전달 할 수 있고,
 * [taxonomy], [entity], [code], [userIdx] 로 업로드하는 파일이 어느 entity 에 귀속되는지 지정하고,
 * 기존에 존재하는 파일을 삭제하는 등, 완전한 업로드 기능을 한다.
 *
 * 다만, 로직은 동일한데, "회원 사진 업로드", "쇼핑몰 사진 업로드", "광고 배너 업로드" 등
 * 디자인의 변경이 많이 있을 수 있어,
 * 이 컴포넌트에서는 하나의 템플릿에 여러개의 디자인을 담도록 한다.
 *
 * 사용 예) 회원 프로필 사진을 수정하려면, 아래와 같이 userIdx 와 code 값만 전달하면 된다.
 * <UploadImage ui="circle" :userIdx="user.idx" code="photoUrl" @uploaded="onProfilePhotoUpload"></UploadImage>
 *
 * [defaultImageUrl] 은 사진을 업로드 하지 않았을 때, 보여 줄 기본 이미지이다.
 *   - 카카오톡이나 구글 등 소셜 로그인을 하면, 그 소셜 로그인의 프로필 사진이 사용자 photoUrl 필드에 저장되는데,
 *     만약, 프로필 사진을 업로드 하지 않았다면, 그 photoUrl 사진을 defaultIamgeUrl 로 넘겨 기본 이미지로
 *     보여 줄 수 있다.
 */
import Vue from "vue";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { translate } from "@/x-vue/services/functions";
import { Component, Prop } from "vue-property-decorator";
import CameraSvg from "@/x-vue/svg/CameraSvg.vue";
import TrashSvg from "@/x-vue/svg/TrashSvg.vue";

@Component({
  components: { CameraSvg, TrashSvg },
})
export default class UploadImage extends Vue {
  @Prop({ default: "linear" }) ui!: "linear" | "circle";
  @Prop() taxonomy!: string;
  @Prop() entity!: number;
  @Prop() code!: string;
  @Prop() userIdx!: number;
  @Prop({ default: "" }) defaultImageUrl!: string;
  percent = 0;
  file: FileModel = new FileModel();
  confirmDelete = translate("do_you_want_to_delete");
  api: ApiService = ApiService.instance;

  // To hide the blinking. To prevent to show the default avatar icon from <b-avatar>.
  loading = true;
  async mounted(): Promise<void> {
    console.log("defaultImageUrl;", this.defaultImageUrl);
    try {
      // 사진을 백엔드에서 가져온다.
      if (this.entity || this.code || this.userIdx) {
        const req = {
          taxonomy: this.taxonomy,
          entity: this.entity,
          code: this.code,
          userIdx: this.userIdx,
        };

        console.log("req;; ", req);
        this.file = await this.api.fileGet(req);

        console.log("file;", this.file);
      }
    } catch (e) {
      if (e !== "error_entity_not_found") {
        this.$emit("error", e);
      } else {
        this.file.url = this.defaultImageUrl;
        // this.$set(this.file, "url", this.defaultImageUrl);
        // console.log("this.file;, ", this.file);
        console.log("e; ", e);
      }
    }
    this.loading = false;
  }

  // Delete previously uploaded image
  // 이전에 업로드된 사진이 있는가?
  // 그렇다면, 이전 업로드된 파일이 쓰레기로 남지 않도록 삭제한다.
  async deleteImage(): Promise<void> {
    if (!this.file.idx) return;
    try {
      await this.api.fileDelete(this.file.idx);
      this.$emit("deleted", this.file.idx);
      this.file = new FileModel();
      if (this.defaultImageUrl) this.file.url = this.defaultImageUrl;
    } catch (e) {
      this.$emit("error", e);
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
      // console.log("User cancelled upload");
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
          this.$emit("progress", p);
        }
      );

      this.$emit("uploaded", this.file);
      this.$emit("progress", 0);
    } catch (e) {
      this.$emit("error", e);
    }
  }
}
</script>

<style lang="scss" scoped>
.close-button {
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
}
.upload-image-circle {
  position: relative;
  overflow: hidden;
  ::-webkit-file-upload-button {
    cursor: pointer;
  }
  .base {
    position: relative;
    overflow: hidden;
    input {
      position: absolute;
      left: 0;
      font-size: 10em;
      opacity: 0.0001;
    }
  }
  .camera {
    position: absolute;
    width: 32px;
    padding: 0.25em;
    box-sizing: content-box;
    left: 0;
    bottom: 0;
  }
  .trash {
    position: absolute;
    right: 0;
    bottom: 1px;
    padding: 0.25em;
    box-sizing: content-box;
    cursor: pointer;
    .trash-icon {
      width: 24px;
      fill: rgb(87, 87, 87);
    }
  }
}
</style>
