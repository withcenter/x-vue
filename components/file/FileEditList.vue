<template>
  <div class="">
    <div class="m-0 row">
      <div class="position-relative p-1 col-3" v-for="file of post.files" :key="file.idx" style="height: 150px">
        <FileEdit :file="file" @delete="onClickDelete"></FileEdit>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * (게시판 전용)
 *
 * 사진(파일)을 나열하고, 삭제 버튼을 클릭하면 삭제한다.
 *
 * 삭제 후, fileIdxes 에 글 번호를 없앤다. 이러한 코드가 게시판 전용이므로, 이 위젯은 게시판 전용이다.
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import Service from "@/x-vue/services/component.service";
import FileEdit from "@/x-vue/components/file/FileEdit.vue";
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";
import { deleteByComma } from "@/x-vue/services/functions";

@Component({
  components: { FileEdit },
})
export default class FileDisplay extends Vue {
  @Prop() post!: PostModel | CommentModel;

  api = ApiService.instance;

  async onClickDelete(file: FileModel): Promise<void> {
    const conf = await Service.instance.confirm("File Delete", "Are you sure you want to delete this file?");
    if (!conf) return;

    try {
      await this.api.fileDelete(file.idx);
      this.onFileDelete(file.idx);
      this.$emit("deleted", file.idx);
    } catch (e) {
      Service.instance.error(e);
    }
  }

  onFileDelete(idx: number): void {
    const index = this.post.files.findIndex((file) => file.idx == idx);
    // console.log("index; ", index);
    this.post.files.splice(index, 1);
    this.post.fileIdxes = deleteByComma(this.post.fileIdxes, idx);
  }
}
</script>
