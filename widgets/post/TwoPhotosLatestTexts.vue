<template>
  <div class="two-photos-latest-texts row">
    <div class="col-3"><PhotoText w="184" h="100" :post="left[0]" :key="key(1)"></PhotoText></div>
    <div class="col-3"><PhotoText w="184" h="100" :post="left[1]" :key="key(2)"></PhotoText></div>
    <div class="col-6 pl-2 latest-posts">
      <router-link class="title d-flex" :to="post.relativeUrl" v-for="post of right" :key="post.idx">
        <div class="text-truncate">{{ post.title }}</div>
        <div class="ml-2" v-if="post.noOfComments">
          <b-badge>{{ post.noOfComments }}</b-badge>
        </div>
      </router-link>
    </div>
  </div>
</template>
<style lang="scss">
.two-photos-latest-texts {
  .photo-text {
    display: block;
    width: 100%;
    height: 140px;
    overflow: hidden;
    font-size: 0.85em;
    .title {
      font-weight: normal;
    }
    img {
      width: 100%;
      height: 100px;
      border-radius: 0.5em;
    }
  }

  .latest-posts {
    .title:first-child {
      padding-top: 0;
    }
    .title {
      display: block;
      padding: 0.25em 0;
      font-weight: normal;
      font-size: 0.85rem;
    }
  }
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import PhotoText from "@/x-vue/widgets/post/PhotoText.vue";
import { ApiService } from "@/x-vue/services/api.service";
import { AppService } from "@/service/app.service";
@Component({
  components: { PhotoText },
})
export default class extends Vue {
  @Prop() leftCategoryId!: string;
  @Prop() rightCategoryId!: string;

  app = AppService.instance;
  api = ApiService.instance;

  left: PostModel[] = [];
  right: PostModel[] = [];

  key(n: number): string {
    let k = this.leftCategoryId + n + this.left.length;
    if (this.left.length) k += this.left[0].idx;
    return k;
  }
  mounted(): void {
    this.api
      .latestPosts(
        { categoryId: this.leftCategoryId, limit: 2, files: "Y" },
        {
          callback: (posts) => (this.left = posts),
        }
      )
      .then((posts) => (this.left = posts))
      .catch((e) => this.app.error(e));

    this.api
      .latestPosts({ categoryId: this.rightCategoryId, limit: 5 }, { callback: (posts) => (this.right = posts) })
      .then((posts) => (this.right = posts))
      .catch((e) => this.app.error(e));
  }
}
</script>
