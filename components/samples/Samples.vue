<template>
  <div class="pb-5">
    <h1>CSS Samples</h1>
    <div class="p-3 bg-white">
      <div>
        <h4>box</h4>
        <p>Boxes are useful for contents wrapping.</p>
        css class: .box
        <div class="box">box</div>

        css class: .box > .box-title
        <div class="box">
          <div class="box-title">box title</div>
          box contents
        </div>

        css class: .box > .box-title.line
        <div class="box">
          <div class="box-title line">box title</div>
          box contents
        </div>
      </div>
    </div>
    <hr />
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
      <h2>PostTitle</h2>
      Display the title of a post
      <b-card>
        <PostTitle></PostTitle>
      </b-card>
    </div>

    <div class="alert alert-info">
      <h2>ThumbnailWithText</h2>
      Display thumbnail and title and content from a post. It uses bootstrap vue 'b-img'. So, you can customize the
      thumbanil with the same option of bootstrap vue.
      <div>Props</div>
      <ul>
        <li>post: PostModel</li>
        <li>thumbnail: boolean - same option of bootstrap-vue</li>
        <li>thumbnailWidth: number</li>
        <li>thumbnailHeight: number</li>
      </ul>
      <b-card>
        <ThumbnailWithTitleAndContent :thumbnailHeight="50" :thumbnailWidth="50"></ThumbnailWithTitleAndContent>
      </b-card>
      <b-card class="mt-1">
        <b-card-title>With thumbnail</b-card-title>
        <thumbnail-with-text :thumbnail="true" :thumbnailHeight="50" :thumbnailWidth="50"></thumbnail-with-text>
      </b-card>
    </div>

    <div class="alert alert-info">
      <h2>TwoStoriesThumbnailWithTitleAndContent</h2>
      Display two ThumbnailWithText from posts

      <div>Props</div>
      <ul>
        <li>posts: PostModel[]</li>
        <li>thumbnail: boolean - same option of bootstrap-vue</li>
        <li>thumbnailWidth: number</li>
        <li>thumbnailHeight: number</li>
      </ul>
      <b-card>
        <two-stories-thumbnail-with-text :thumbnail="true"></two-stories-thumbnail-with-text>
      </b-card>
    </div>

    <p>..</p>
    <p>..</p>
    <p>..</p>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PostsTitleList</h5>
        <p class="card-text">
          Display list of post title.
          <br />
          @property - categoryId string
          <br />
          @property - limit number (5 default)
          <br />
          @property - posts PostModel[]
          <br />
          @property - bulleted boolean (true default)
        </p>
        <hr />
        <PostsTitleList></PostsTitleList>
      </div>
    </div>

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
        <h5 class="card-title">PhotoTextBottom</h5>
        <p class="card-text">
          Displays thumbnail with text at bottom of image.
          <br />
          @property - post PostModel
          <br />
          @property - imageHeight number (200 default)
        </p>
        <hr />
        <PhotoTextBottom></PhotoTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoByTwoPhotoTextBottom</h5>
        <p class="card-text">
          Displays 4 post thumbnail with texts at bottom.
          <br />
          @property - categoryId string
          <br />
          @property - imageHeight number (200 default)
        </p>
        <hr />
        <TwoByTwoPhotoTextBottom></TwoByTwoPhotoTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoInlineTextBottom</h5>
        <p class="card-text">
          Displays thumbnail with inline text.
          <br />
          @property - post PostModel
          <br />
          @property - imageHeight number (200 default)
        </p>
        <hr />
        <PhotoInlineTextBottom></PhotoInlineTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoByTwoPhotoInlineTextBottom</h5>
        <p class="card-text">
          Displays 4 post thumbnail with inline texts.
          <br />
          @property - categoryId string
          <br />
          @property - itemHeight number (200px default)
        </p>
        <hr />
        <TwoByTwoPhotoInlineTextBottom></TwoByTwoPhotoInlineTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoWithTextsAtRight</h5>
        <p class="card-text">
          Displays 1 Photo on left and several post as text on right.
          <br />
          @property - categoryId string
          <br />
          @property - imageHeight number (215 default)
          <br />
          @property - limit number (7 default)
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
          <br />
          @property - itemHeight number (150px default)
        </p>
        <hr />
        <FourPhotosWithTextBottom></FourPhotosWithTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoTextsTopPhotosBottom</h5>
        <p class="card-text">
          Displays 1 photo with text at right on top and 4 photo with text at bottom.
          <br />
          @property - categoryIdTop string
          <br />
          @property - categoryIdBottom string
        </p>
        <hr />
        <PhotoTextsTopPhotosBottom></PhotoTextsTopPhotosBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAndMeta</h5>
        <p class="card-text">
          Displays 1 photo with text and meta information.
          <br />
          @property - post PostModel
        </p>
        <hr />
        <ThumbnailWithTextAndMeta></ThumbnailWithTextAndMeta>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAndMetaList</h5>
        <p class="card-text">
          Display list of `ThumbnailWithTextAndMeta` widget.
          <br />
          @property - categoryId string
          <br />
          @property - limit number (5 default)
        </p>
        <hr />
        <ThumbnailWithTextAndMetaList></ThumbnailWithTextAndMetaList>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoWithTextsAtBottom</h5>
        <p class="card-text">
          PhotoWithTextsAtBottom
          <br />
          @property - post PostModel
          <br />
          @property - imageHeight number (200 default)
        </p>
        <hr />
        <PhotoWithTextsAtBottom></PhotoWithTextsAtBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">OneByOnePhotoWithTextsAtBottom</h5>
        <p class="card-text">
          OneByOnePhotoWithTextsAtBottom
          <br />
          @property - post PostModel
          <br />
          @property - limit number (5 default)
          <br />
          @property - imageHeight number (200 default)
        </p>
        <hr />
        <OneByOnePhotoWithTextsAtBottom></OneByOnePhotoWithTextsAtBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAtRight</h5>
        <p class="card-text">
          Displays thumbnail on left and text (title) on right.
          <br />
          @property post PostModel
          <br />
          @property isTwoLine boolean (false default) - if true, 2 lines of text will be shown if it can't fit in one
          line.
        </p>
        <hr />
        <ThumbnailWithTextAtRight></ThumbnailWithTextAtRight>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAtRightList</h5>
        <p class="card-text">
          Display list of `ThumbnailWithTextAtRight` depending on the limit provided
          <br />
          @property categoryId string
          <br />
          @property limit number (2 default)
          <br />
          @property isTwoLine boolean (false default) - if true, 2 lines of text will be shown if it can't fit in one
          line.
        </p>
        <hr />
        <ThumbnailWithTextAtRightList></ThumbnailWithTextAtRightList>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TextsTopTwoThumbnailTextBottom</h5>
        <p class="card-text">TextsTopTwoThumbnailTextBottom</p>
        <hr />
        <TextsTopTwoThumbnailTextBottom></TextsTopTwoThumbnailTextBottom>
      </div>
    </div>
    <!--  -->
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
import CameraSvg from "@/x-vue/svg/CameraSvg.vue";
import UploadButton from "@/x-vue/components/buttons/UploadButton.vue";
import FileUploadButton from "@/x-vue/components/file/FileUploadButton.vue";
import ComponentService from "@/x-vue/services/component.service";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import PostTitle from "@/x-vue/widgets/post/PostTitle.vue";

import LatestPostsText from "@/x-vue/widgets/post/LatestPostsText.vue";
import PhotoTextBottom from "@/x-vue/widgets/post/PhotoTextBottom.vue";
import PhotoInlineTextBottom from "@/x-vue/widgets/post/PhotoInlineTextBottom.vue";
import TwoByTwoPhotoInlineTextBottom from "@/x-vue/widgets/post/TwoByTwoPhotoInlineTextBottom.vue";
import TwoByTwoPhotoTextBottom from "@/x-vue/widgets/post/TwoByTwoPhotoTextBottom.vue";
import ThumbnailWithTitleAndContent from "@/x-vue/widgets/post/ThumbnailWithTitleAndContent.vue";
import TwoStoriesThumbnailWithText from "@/x-vue/widgets/post/TwoStoriesThumbnailWithText.vue";
import PhotoWithTextsAtRight from "@/x-vue/widgets/post/PhotoWithTextsAtRight.vue";
import FourPhotosWithTextBottom from "@/x-vue/widgets/post/FourPhotosWithTextBottom.vue";
import PhotoTextsTopPhotosBottom from "@/x-vue/widgets/post/PhotoTextsTopPhotosBottom.vue";
import ThumbnailWithTextAndMeta from "@/x-vue/widgets/post/ThumbnailWithTextAndMeta.vue";
import ThumbnailWithTextAndMetaList from "@/x-vue/widgets/post/ThumbnailWithTextAndMetaList.vue";
import PostsTitleList from "@/x-vue/widgets/post/PostsTitleList.vue";
import PhotoWithTextsAtBottom from "@/x-vue/widgets/post/PhotoWithTextsAtBottom.vue";
import OneByOnePhotoWithTextsAtBottom from "@/x-vue/widgets/post/OneByOnePhotoWithTextsAtBottom.vue";

import ThumbnailWithTextAtRight from "@/x-vue/widgets/post/ThumbnailWithTextAtRight.vue";
import ThumbnailWithTextAtRightList from "@/x-vue/widgets/post/ThumbnailWithTextAtRightList.vue";
import TextsTopTwoThumbnailTextBottom from "@/x-vue/widgets/post/TextsTopTwoThumbnailTextBottom.vue";

@Component({
  components: {
    CameraSvg,
    UploadButton,
    FileUploadButton,
    PostTitle,
    LatestPostsText,
    PhotoTextBottom,
    PhotoInlineTextBottom,
    TwoByTwoPhotoInlineTextBottom,
    TwoByTwoPhotoTextBottom,
    ThumbnailWithTitleAndContent,
    TwoStoriesThumbnailWithText,
    PhotoWithTextsAtRight,
    FourPhotosWithTextBottom,
    PhotoTextsTopPhotosBottom,
    ThumbnailWithTextAndMeta,
    ThumbnailWithTextAndMetaList,
    PostsTitleList,
    PhotoWithTextsAtBottom,
    OneByOnePhotoWithTextsAtBottom,
    ThumbnailWithTextAtRight,
    ThumbnailWithTextAtRightList,
    TextsTopTwoThumbnailTextBottom,
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
