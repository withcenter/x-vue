<template>
  <div class="pb-5">
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

    <div class="alert alert-info">
      <h2>LatestText</h2>
      Display the title of a post
      <b-card>
        <LatestText></LatestText>
      </b-card>
    </div>

    <div class="alert alert-info">
      <h2>ThumbnailWithText</h2>
      Display thumbnail and title and content from a post
      <div>Props</div>
      <ul>
        <li>post: PostModel</li>
        <li>thumbnailWidth: number</li>
        <li>thumbnailHeight: number</li>
      </ul>
      <b-card>
        <thumbnail-with-text
          :thumbnailHeight="50"
          :thumbnailWidth="50"
        ></thumbnail-with-text>
      </b-card>
    </div>

    <div class="alert alert-info">
      <h2>TwoStoriesThumbnailWithText</h2>
      Display two ThumbnailWithText from posts

      <div>Props</div>
      <ul>
        <li>posts: PostModel[]</li>
        <li>thumbnailWidth: number</li>
        <li>thumbnailHeight: number</li>
      </ul>
      <b-card>
        <two-stories-thumbnail-with-text></two-stories-thumbnail-with-text>
      </b-card>
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

import ThumbnailWithText from "@/x-vue/widgets/post/ThumbnailWithText.vue";
import TwoStoriesThumbnailWithText from "@/x-vue/widgets/post/TwoStoriesThumbnailWithText.vue";

@Component({
  components: {
    CameraSvg,
    UploadButton,
    FileUploadButton,
    LatestText,
    ThumbnailWithText,
    TwoStoriesThumbnailWithText,
  },
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
