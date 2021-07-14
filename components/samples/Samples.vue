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
        css class: .box.no-border > .box-title.line
        <div class="box no-border bg-primary">
          <div class="box-title line">box title</div>
          box contents
        </div>
      </div>
    </div>
    <hr />
    <h1>Svg Icons</h1>
    <div class="svgs">
      <CameraSvg></CameraSvg>
      <ChatBubbleSvg></ChatBubbleSvg>
      <CoffeeBreakSvg></CoffeeBreakSvg>
      <EllipsisVSvg></EllipsisVSvg>
      <ExternalLinkSvg></ExternalLinkSvg>
      <FacebookLogoSvg></FacebookLogoSvg>
      <GoogleLogoSvg></GoogleLogoSvg>
      <MenuSvg></MenuSvg>
      <ProductHuntSvg></ProductHuntSvg>
      <SearchSvg></SearchSvg>
      <TrashSvg></TrashSvg>

      <UpArrowSvg></UpArrowSvg>
      <LeftArrowSvg></LeftArrowSvg>
      <RightArrowSvg></RightArrowSvg>
      <DownArrowSvg></DownArrowSvg>

      <ManSvg></ManSvg>
      <WomanSvg></WomanSvg>

      <BoxArrowInDownSvg></BoxArrowInDownSvg>
      <BoxArrowInUpSvg></BoxArrowInUpSvg>
      <BoxArrowUpRightSvg></BoxArrowUpRightSvg>
      <CloseSvg></CloseSvg>
      <PencilSquareSvg></PencilSquareSvg>
      <PencilSvg></PencilSvg>
      <ArrowLeftRightSvg></ArrowLeftRightSvg>
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

    <div class="my-3">
      <h2>PhotoTitleContent</h2>
      <p>Displays thumbanil photo, title, and content</p>
      <PhotoTitleContent class="mt-2"></PhotoTitleContent>
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
        <ThumbnailWithText class="child-image-size-xl"></ThumbnailWithText>
      </b-card>
      <b-card class="mt-1">
        <b-card-title>With thumbnail and .child-image-size-xl.child-image-size-lg-md</b-card-title>
        <ThumbnailWithText class="child-image-size-xl child-image-size-lg-md" :thumbnail="true"></ThumbnailWithText>
      </b-card>
    </div>

    <div class="alert alert-info">
      <h4>TwoStoriesThumbnailWithText</h4>
      Display two ThumbnailWithText from posts

      <div>Props</div>
      <ul>
        <li>posts: PostModel[]</li>
        <li>thumbnail: boolean - same option of bootstrap-vue</li>
        <li>thumbnailWidth: number</li>
        <li>thumbnailHeight: number</li>
      </ul>
      <b-card>
        <TwoStoriesThumbnailWithText :thumbnail="true"></TwoStoriesThumbnailWithText>
      </b-card>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PostsTitleList</h5>
        <p class="card-text">
          Display list of post title.
          <br />
          categoryId string
          <br />
          limit number (5 default)
          <br />
          posts PostModel[]
          <br />
          bulleted boolean (true default)
        </p>
        <hr />
        Without Bullet
        <PostsTitleList></PostsTitleList>
        <hr />
        With Bullet
        <PostsTitleList :bulleted="true"></PostsTitleList>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">LatestPostsTextOnly</h5>
        <p class="card-text">
          Displays list of latest posts only in text.
          <br />
          limit number (10 default)
        </p>
        <hr />
        <LatestPostsTextOnly></LatestPostsTextOnly>
      </div>
    </div>
    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">LatestPostsText</h5>
        <p class="card-text">
          Displays list of latest posts only in text.
          <br />
          limit number (10 default)
        </p>
        <hr />
        <LatestPostsText :title="'Latest Post'"></LatestPostsText>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoText</h5>
        <p class="card-text">
          Displays thumbnail with text at bottom of image.<br />
          This is more convinient to customize the design since it has no hard coded css style by not using b-img.
          <br />
          post PostModel
          <br />
        </p>
        <hr />
        <PhotoText class=""></PhotoText>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoTextBottom</h5>
        <p class="card-text">
          Displays thumbnail with text at bottom of image.
          <br />
          post PostModel
          <br />
        </p>
        <hr />
        <PhotoTextBottom class="child-image-height-md child-image-height-lg child-image-height-xl"></PhotoTextBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoByTwoPhotoTextBottom</h5>
        <p class="card-text">
          Displays 4 post thumbnail with texts at bottom.
          <br />
          categoryId string
          <br />
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
          post PostModel
          <br />
          categoryId string
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
          categoryId string
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
          categoryId string
          <br />
          photo PostModel
          <br />
          limit number (7 default)
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
          categoryId string
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
          categoryIdTop string
          <br />
          categoryIdBottom string
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
          categoryId string
          <br />
          post PostModel
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
          categoryId string
          <br />
          limit number (5 default)
        </p>
        <hr />
        <ThumbnailWithTextAndMetaList></ThumbnailWithTextAndMetaList>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAndMetaAtBottom</h5>
        <p class="card-text">
          ThumbnailWithTextAndMetaAtBottom
          <br />
          categoryId string
          <br />
          post PostModel
          <br />
        </p>
        <hr />
        <ThumbnailWithTextAndMetaAtBottom></ThumbnailWithTextAndMetaAtBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">OneByOneThumbnailWithTextAndMetaAtBottom</h5>
        <p class="card-text">
          Display 2 colump of a photo with texts at bottom
          <br />
          firstCategoryId string
          <br />
          secondCategoryId string
        </p>
        <hr />
        <OneByOneThumbnailWithTextAndMetaAtBottom
          class="child-img-height-100"
        ></OneByOneThumbnailWithTextAndMetaAtBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">OneByOnePhotoInlineText</h5>
        <p class="card-text">
          Display 2 Photo with inline text
          <br />
          categoryId string
          <br />
          isMultilineText boolean (false default)
        </p>
        <hr />
        <OneByOnePhotoInlineText></OneByOnePhotoInlineText>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">OneByOnePhotoTextBottom</h5>
        <p class="card-text">
          Display 2 Photo with text at bottom
          <br />
          categoryId string
          <br />
          isMultilineText boolean (false default)
        </p>
        <hr />
        <OneByOnePhotoTextBottom></OneByOnePhotoTextBottom>
      </div>
    </div>
    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoPhotosTopTextsMiddleFourPhotosBottom</h5>
        <p class="card-text">
          Display 2 Photo with text at bottom on top, Posts list text on middle and 4 Photo with text bottom on bottom.
          <br />
          firstCategoryId string
          <br />
          secondCategoryId string
          <br />
          thirdCategoryId string
        </p>
        <hr />
        <TwoPhotosTopTextsMiddleFourPhotosBottom></TwoPhotosTopTextsMiddleFourPhotosBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAtRight</h5>
        <p class="card-text">
          Displays thumbnail on left and text (title) on right.
          <br />
          categoryId string <br />
          post PostModel <br />
          isTwoLine boolean (true default) - if true, 2 lines of text will be shown if it can't fit in one line.
        </p>
        <hr />
        Single line
        <ThumbnailWithTextAtRight :isMultiLine="false" :isCenterAligned="false"></ThumbnailWithTextAtRight>
        <hr />
        Multi line and vertically aligned center text.
        <ThumbnailWithTextAtRight></ThumbnailWithTextAtRight>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextAtRightList</h5>
        <p class="card-text">
          Display list of `ThumbnailWithTextAtRight` depending on the limit provided
          <br />
          categoryId string <br />
          limit number (2 default) <br />
          isTwoLine boolean (false default) - if true, 2 lines of text will be shown if it can't fit in one line.
        </p>
        <hr />
        <ThumbnailWithTextAtRightList></ThumbnailWithTextAtRightList>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TextsTopThumbnailTextListBottom</h5>
        <p class="card-text">
          Display list of post title text on top, and list of thumbnail with text on bottom.
          <br />
          firstCategoryId string <br />
          firstLimit number (3 default) <br />
          secondCategoryId string <br />
          secondLimit number (7 default)
        </p>
        <hr />
        <TextsTopThumbnailTextListBottom></TextsTopThumbnailTextListBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoPhotoTopThumbnailsWithTextAndPhotoBottom</h5>
        <p class="card-text">
          Displays a combination of Photo with inline text and Thumbnail with text
          <br />
          textListLimit number (8 default) - limit for the post text list panel. <br />
          firstCategory string <br />
          secondCategory string <br />
          thirdCategory string <br />
          fourthCategory string
        </p>
        <hr />
        <TwoPhotoTopThumbnailsWithTextAndPhotoBottom></TwoPhotoTopThumbnailsWithTextAndPhotoBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoColumnStoryGroupA</h5>
        <p class="card-text">
          Displays a combination of Photo with inline text and Thumbnail with text on the left panel, and List of post
          title and thumbnail with text right panel.
          <br />
          firstCategories string[] - first set of categories for the left panel. <br />
          secondCategories string[] - second set of categories for the right panel.
        </p>
        <hr />
        <TwoColumnStoryGroupA></TwoColumnStoryGroupA>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailWithTextListTopTextsBottom</h5>
        <p class="card-text">
          Displays list of thumbnail with text at right on top, and list of post title on the bottom.
          <br />
          firstCategoryId string <br />
          firstLimit number (3 default) <br />
          secondCategoryId string <br />
          secondLimit number (7 default)
        </p>
        <hr />
        <ThumbnailWithTextListTopTextsBottom></ThumbnailWithTextListTopTextsBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">PhotoTextBottomTopThumbnailTextListBottom</h5>
        <p class="card-text">
          Displays Photo with text at bottom and List of thumbnail with text at right on the bottom part.
          <br />
          firstCategoryId string <br />
          secondCategoryId string <br />
          listLimit number (7 default) - default limit for the bottom list.
        </p>
        <hr />
        <PhotoTextBottomTopThumbnailTextListBottom></PhotoTextBottomTopThumbnailTextListBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThreeColumnStoryGroupA</h5>
        <p class="card-text">
          secondCategories string[] - 2 categories <br />
          thirdCategories string[] - 4 categories <br />
        </p>
        <hr />
        <ThreeColumnStoryGroupA></ThreeColumnStoryGroupA>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TitleAndContentTopPhotoBottom</h5>
        <p class="card-text">
          categoryId string <br />
          post Postmodel <br />
          -<br />
          @note: If `categoryId` is provided, it will fetch a post, if `post` is provided it will use the post. <br />
          if `categoryId` and `post` is both provided, it will prioritize to use the `post` instead of fetching. <br />
          if both `categoryId` and `post` is not provided, it will use mock post data.
        </p>
        <hr />
        <TitleAndContentTopPhotoBottom></TitleAndContentTopPhotoBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">ThumbnailTextListTopTextMiddleTextsBottom</h5>
        <p class="card-text">
          firstCategoryId string <br />
          secondCategoryId string <br />
          thirdCategoryId string <br />
          topListLimit number (3 default)<br />
          bottomListLimit number (3 default)
        </p>
        <hr />
        <ThumbnailTextListTopTextMiddleTextsBottom></ThumbnailTextListTopTextMiddleTextsBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TitleContentPhotoTopAndTextListBottom</h5>
        <p class="card-text">
          firstCategoryId string <br />
          secondCategoryId string <br />
        </p>
        <hr />
        <TitleContentPhotoTopAndTextListBottom></TitleContentPhotoTopAndTextListBottom>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-body">
        <h5 class="card-title">TwoColumnStoryGroupB</h5>
        <p class="card-text">
          leftCategories string[] - 2 categories <br />
          rightCategories string[] - 3 categories
        </p>
        <hr />
        <TwoColumnStoryGroupB></TwoColumnStoryGroupB>
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
.svgs {
  svg {
    padding: 1em;
    box-sizing: content-box;
    width: 32px;
    height: 32px;
  }
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
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
import ThumbnailWithText from "@/x-vue/widgets/post/ThumbnailWithText.vue";
import TwoStoriesThumbnailWithText from "@/x-vue/widgets/post/TwoStoriesThumbnailWithText.vue";
import PhotoWithTextsAtRight from "@/x-vue/widgets/post/PhotoWithTextsAtRight.vue";
import FourPhotosWithTextBottom from "@/x-vue/widgets/post/FourPhotosWithTextBottom.vue";
import PhotoTextsTopPhotosBottom from "@/x-vue/widgets/post/PhotoTextsTopPhotosBottom.vue";
import ThumbnailWithTextAndMeta from "@/x-vue/widgets/post/ThumbnailWithTextAndMeta.vue";
import ThumbnailWithTextAndMetaList from "@/x-vue/widgets/post/ThumbnailWithTextAndMetaList.vue";
import PostsTitleList from "@/x-vue/widgets/post/PostsTitleList.vue";
import ThumbnailWithTextAndMetaAtBottom from "@/x-vue/widgets/post/ThumbnailWithTextAndMetaAtBottom.vue";
import OneByOneThumbnailWithTextAndMetaAtBottom from "@/x-vue/widgets/post/OneByOneThumbnailWithTextAndMetaAtBottom.vue";
import OneByOnePhotoInlineText from "@/x-vue/widgets/post/OneByOnePhotoInlineText.vue";
import OneByOnePhotoTextBottom from "@/x-vue/widgets/post/OneByOnePhotoTextBottom.vue";
import TwoPhotosTopTextsMiddleFourPhotosBottom from "@/x-vue/widgets/post/TwoPhotosTopTextsMiddleFourPhotosBottom.vue";

import ThumbnailWithTextAtRight from "@/x-vue/widgets/post/ThumbnailWithTextAtRight.vue";
import ThumbnailWithTextAtRightList from "@/x-vue/widgets/post/ThumbnailWithTextAtRightList.vue";
import TextsTopThumbnailTextListBottom from "@/x-vue/widgets/post/TextsTopThumbnailTextListBottom.vue";
import TwoPhotoTopThumbnailsWithTextAndPhotoBottom from "@/x-vue/widgets/post/TwoPhotoTopThumbnailsWithTextAndPhotoBottom.vue";
import TwoColumnStoryGroupA from "@/x-vue/widgets/post/TwoColumnStoryGroupA.vue";
import ThumbnailWithTextListTopTextsBottom from "@/x-vue/widgets/post/ThumbnailWithTextListTopTextsBottom.vue";
import PhotoTextBottomTopThumbnailTextListBottom from "@/x-vue/widgets/post/PhotoTextBottomTopThumbnailTextListBottom.vue";
import ThreeColumnStoryGroupA from "@/x-vue/widgets/post/ThreeColumnStoryGroupA.vue";
import TitleAndContentTopPhotoBottom from "@/x-vue/widgets/post/TitleAndContentTopPhotoBottom.vue";
import ThumbnailTextListTopTextMiddleTextsBottom from "@/x-vue/widgets/post/ThumbnailTextListTopTextMiddleTextsBottom.vue";
import TitleContentPhotoTopAndTextListBottom from "@/x-vue/widgets/post/TitleContentPhotoTopAndTextListBottom.vue";
import TwoColumnStoryGroupB from "@/x-vue/widgets/post/TwoColumnStoryGroupB.vue";

import LatestPostsTextOnly from "@/x-vue/widgets/post/LatestPostsTextOnly.vue";
import CameraSvg from "@/x-vue/svg/CameraSvg.vue";
import ChatBubbleSvg from "@/x-vue/svg/ChatBubbleSvg.vue";
import CoffeeBreakSvg from "@/x-vue/svg/CoffeeBreakSvg.vue";
import EllipsisVSvg from "@/x-vue/svg/EllipsisVSvg.vue";
import FacebookLogoSvg from "@/x-vue/svg/FacebookLogoSvg.vue";
import GoogleLogoSvg from "@/x-vue/svg/GoogleLogoSvg.vue";
import MenuSvg from "@/x-vue/svg/MenuSvg.vue";
import ProductHuntSvg from "@/x-vue/svg/ProductHuntSvg.vue";
import SearchSvg from "@/x-vue/svg/SearchSvg.vue";
import TrashSvg from "@/x-vue/svg/TrashSvg.vue";
import UpArrowSvg from "@/x-vue/svg/UpArrowSvg.vue";
import LeftArrowSvg from "@/x-vue/svg/LeftArrowSvg.vue";
import RightArrowSvg from "@/x-vue/svg/RightArrowSvg.vue";
import DownArrowSvg from "@/x-vue/svg/DownArrowSvg.vue";
import ManSvg from "@/x-vue/svg/ManSvg.vue";
import WomanSvg from "@/x-vue/svg/WomanSvg.vue";

import ExternalLinkSvg from "@/x-vue/svg/ExternalLinkSvg.vue";
import BoxArrowInDownSvg from "@/x-vue/svg/BoxArrowInDownSvg.vue";
import BoxArrowInUpSvg from "@/x-vue/svg/BoxArrowInUpSvg.vue";
import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";
import CloseSvg from "@/x-vue/svg/CloseSvg.vue";
import PencilSquareSvg from "@/x-vue/svg/PencilSquareSvg.vue";
import PencilSvg from "@/x-vue/svg/PencilSvg.vue";

import ArrowLeftRightSvg from "@/x-vue/svg/ArrowLeftRightSvg.vue";

import PhotoTitleContent from "@/x-vue/widgets/post/PhotoTitleContent.vue";
import PhotoText from "@/x-vue/widgets/post/PhotoText.vue";

@Component({
  components: {
    CameraSvg,
    ChatBubbleSvg,
    CoffeeBreakSvg,
    EllipsisVSvg,
    ExternalLinkSvg,
    FacebookLogoSvg,
    GoogleLogoSvg,
    MenuSvg,
    ProductHuntSvg,
    SearchSvg,
    TrashSvg,
    UpArrowSvg,
    LeftArrowSvg,
    RightArrowSvg,
    DownArrowSvg,
    ManSvg,
    WomanSvg,
    BoxArrowInDownSvg,
    BoxArrowInUpSvg,
    BoxArrowUpRightSvg,
    CloseSvg,
    PencilSquareSvg,
    PencilSvg,
    ArrowLeftRightSvg,

    UploadButton,
    FileUploadButton,
    PostTitle,
    LatestPostsText,
    PhotoTextBottom,
    PhotoInlineTextBottom,
    TwoByTwoPhotoInlineTextBottom,
    TwoByTwoPhotoTextBottom,
    ThumbnailWithText,
    TwoStoriesThumbnailWithText,
    PhotoWithTextsAtRight,
    FourPhotosWithTextBottom,
    PhotoTextsTopPhotosBottom,
    ThumbnailWithTextAndMeta,
    ThumbnailWithTextAndMetaList,
    PostsTitleList,
    ThumbnailWithTextAndMetaAtBottom,
    OneByOneThumbnailWithTextAndMetaAtBottom,
    OneByOnePhotoInlineText,
    OneByOnePhotoTextBottom,
    TwoPhotosTopTextsMiddleFourPhotosBottom,
    ThumbnailWithTextAtRight,
    ThumbnailWithTextAtRightList,
    TextsTopThumbnailTextListBottom,
    TwoPhotoTopThumbnailsWithTextAndPhotoBottom,
    TwoColumnStoryGroupA,
    ThumbnailWithTextListTopTextsBottom,
    PhotoTextBottomTopThumbnailTextListBottom,
    LatestPostsTextOnly,
    ThreeColumnStoryGroupA,
    TitleAndContentTopPhotoBottom,
    ThumbnailTextListTopTextMiddleTextsBottom,
    TitleContentPhotoTopAndTextListBottom,
    TwoColumnStoryGroupB,
    PhotoTitleContent,
    PhotoText,
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
