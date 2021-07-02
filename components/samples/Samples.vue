<template>
  <div>
    <h1>Samples of Components and Widgets</h1>

    <div class="alert alert-info">
      <h2>CameraSvg</h2>
      Simply display a camera icon without any reaction.
      <div><CameraSvg class="size-sm"></CameraSvg></div>
    </div>

    <div class="alert alert-info">
      <h2>UploadButton</h2>
      Notifies when file change.
      <UploadButton @change="onChange"></UploadButton>
    </div>

    <div class="alert alert-info">
      <h2>FileUploadButton</h2>
      Uploads a file into backend.
      <FileUploadButton @uploaded="onUploaded"></FileUploadButton>
    </div>

    <div class="card" style="width: 18rem">
      <div class="card-body">
        <h5 class="card-title">LatestText</h5>
        <p class="card-text">Display the title of a post</p>
        <hr />
        <p><LatestText></LatestText></p>
      </div>
    </div>
    <p>..</p>
    <p>..</p>
    <p>..</p>
  </div>
</template>
<style lang="scss">
.size-sm {
  width: 32px;
  height: 32px;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CameraSvg from "@/x-vue/components/svg/CameraSvg.vue";
import UploadButton from "@/x-vue/components/buttons/UploadButton.vue";
import FileUploadButton from "@/x-vue/components/file/FileUploadButton.vue";
import ComponentService from "@/x-vue/services/x-vue.service";
import { FileModel } from "@/x-vue/services/interfaces";
import LatestText from "@/x-vue/widgets/post/LatestText.vue";
@Component({
  components: { CameraSvg, UploadButton, FileUploadButton, LatestText },
})
export default class Samples extends Vue {
  cs = ComponentService.instance;

  onUploaded(file: FileModel) {
    alert("uploaded: " + file.url);
  }
  onChange(event: Event) {
    alert("file chagned");
  }
}
</script>
