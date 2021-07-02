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

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">LatestPostsText</h5>
        <p class="card-text">
          Displays list of latest posts only in text.
          <br />
          @property - limit number (10 default)
        </p>
        <hr />
        <LatestPostsText></LatestPostsText>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextBottom</h5>
        <p class="card-text">
          Displays thumbnail with text at bottom of image.
          <br />
          @property - post PostModel
        </p>
        <hr />
        <ThumbnailWithTextBottom></ThumbnailWithTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoByTwoThumbnailWithTextBottom</h5>
        <p class="card-text">
          Displays 4 post thumbnail with texts at bottom.
          <br />
          @property - categoryId string
        </p>
        <hr />
        <TwoByTwoThumbnailWithTextBottom></TwoByTwoThumbnailWithTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithInlineText</h5>
        <p class="card-text">
          Displays thumbnail with inline text.
          <br />
          @property - post PostModel
        </p>
        <hr />
        <ThumbnailWithInlineText></ThumbnailWithInlineText>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoByTwoThumbnailInlineText</h5>
        <p class="card-text">
          Displays 4 post thumbnail with inline texts.
          <br />
          @property - categoryId string
          <br />
          @property - itemHeight number (150px default)
        </p>
        <hr />
        <TwoByTwoThumbnailInlineText></TwoByTwoThumbnailInlineText>
      </div>
    </div>
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

import LatestPostsText from "@/x-vue/widgets/post/LatestPostsText.vue";
import ThumbnailWithTextBottom from "@/x-vue/widgets/post/ThumbnailWithTextBottom.vue";
import ThumbnailWithInlineText from "@/x-vue/widgets/post/ThumbnailWithInlineText.vue";
import TwoByTwoThumbnailInlineText from "@/x-vue/widgets/post/TwoByTwoThumbnailInlineText.vue";
import TwoByTwoThumbnailWithTextBottom from "@/x-vue/widgets/post/TwoByTwoThumbnailWithTextBottom.vue";

@Component({
  components: {
    CameraSvg,
    UploadButton,
    FileUploadButton,
    LatestText,
    LatestPostsText,
    ThumbnailWithTextBottom,
    ThumbnailWithInlineText,
    TwoByTwoThumbnailInlineText,
    TwoByTwoThumbnailWithTextBottom,
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
