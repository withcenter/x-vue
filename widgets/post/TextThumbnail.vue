<template>
  <div>
    <router-link :to="post.relativeUrl" class="d-flex mb-3 round" v-for="post in posts" :key="post.idx">
      <div class="ml-auto mr-3 fs-sm text-right overflow-hidden">
        <div class="d-flex justify-content-end">
          <div class="bold text-truncate">{{ post.title }}</div>
          <div class="ml-2" v-if="post.noOfComments">
            <b-badge>{{ post.noOfComments }}</b-badge>
          </div>
        </div>
        <div class="mt-1 text-truncate">
          {{ post.content }}
        </div>
        <div class="mt-1">
          {{ post.user.displayName }}
          •
          {{ post.shortDate }}
        </div>
        <div class="mt-2 grey italic text-truncate" v-if="post.comments.length">{{ post.comments[0].content }}</div>
      </div>
      <div class=""><b-img-lazy class="thumbnail-md" :src="post.files[0].thumbnailUrl"></b-img-lazy></div>
    </router-link>
  </div>
</template>
<script lang="ts">
import { AppService } from "@/service/app.service";
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() categoryId!: string;

  posts: PostModel[] = [];

  mounted(): void {
    ApiService.instance
      .latestPosts({ categoryId: this.categoryId, files: "Y", limit: 3 }, { callback: (posts) => (this.posts = posts) })
      .then((posts) => (this.posts = posts))
      .catch((e) => AppService.instance.error(e));
  }
}
</script>
