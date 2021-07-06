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
        <thumbnail-with-text :thumbnailHeight="50" :thumbnailWidth="50"></thumbnail-with-text>
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

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">LatestPostsText</h5>
        <p class="card-text">
          Displays list of latest posts only in text.
          <br />
          @property - limit number (10 default)
        </p>
        <hr />
        <LatestPostsText :title="'Latest Post'"></LatestPostsText>
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

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoWithTextsAtRight</h5>
        <p class="card-text">
          Displays 1 Photo on left and several post as text on right.
          <br />
          @property - categoryId string
        </p>
        <hr />
        <PhotoWithTextsAtRight></PhotoWithTextsAtRight>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">FourPhotosWithTextBottom</h5>
        <p class="card-text">
          Displays 4 Photo on with text at bottom.
          <br />
          @property - categoryId string
        </p>
        <hr />
        <FourPhotosWithTextBottom></FourPhotosWithTextBottom>
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
import ComponentService from "@/x-vue/services/component.service";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import LatestText from "@/x-vue/widgets/post/LatestText.vue";

import LatestPostsText from "@/x-vue/widgets/post/LatestPostsText.vue";
import ThumbnailWithTextBottom from "@/x-vue/widgets/post/ThumbnailWithTextBottom.vue";
import ThumbnailWithInlineText from "@/x-vue/widgets/post/ThumbnailWithInlineText.vue";
import TwoByTwoThumbnailInlineText from "@/x-vue/widgets/post/TwoByTwoThumbnailInlineText.vue";
import TwoByTwoThumbnailWithTextBottom from "@/x-vue/widgets/post/TwoByTwoThumbnailWithTextBottom.vue";
import ThumbnailWithText from "@/x-vue/widgets/post/ThumbnailWithText.vue";
import TwoStoriesThumbnailWithText from "@/x-vue/widgets/post/TwoStoriesThumbnailWithText.vue";
import PhotoWithTextsAtRight from "@/x-vue/widgets/post/PhotoWithTextsAtRight.vue";
import FourPhotosWithTextBottom from "@/x-vue/widgets/post/FourPhotosWithTextBottom.vue";

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
    ThumbnailWithText,
    TwoStoriesThumbnailWithText,
    PhotoWithTextsAtRight,
    FourPhotosWithTextBottom,
  },
})
export default class Samples extends Vue {
  cs = ComponentService.instance;

  onUploaded(file: FileModel): void {
    alert("uploaded: " + file.url);
  }
  onChange(event: Event): void {
    alert("file chagned" + event.type);
  }
}
</script>
