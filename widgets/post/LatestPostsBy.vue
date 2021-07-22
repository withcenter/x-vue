<template>
  <section class="latest-posts-by">
    <router-link :to="post.relativeUrl" class="d-block mt-2" v-for="post of posts" :key="post.idx">
      <div class="d-flex">
        <div class="photo" v-if="post.files.length">
          <img :src="post.files[0].thumbnailUrl" />
        </div>
        <div class="ml-2 overflow-hidden">
          <div class="d-flex">
            <div class="title text-truncate">
              {{ post.title }}
            </div>
            <div class="d-flex align-items-center">
              <b-badge class="no-of-comments">{{ post.noOfComments }}</b-badge>
            </div>
          </div>
          <div class="comment text-truncate" v-if="post.comments.length">{{ post.comments[0].content | t }}</div>
          <div class="category">{{ post.categoryId | t }}</div>
        </div>
      </div>
    </router-link>
  </section>
</template>
<style lang="scss" scoped>
.photo {
  img {
    width: 72px;
    height: 72px;
    overflow: hidden;
  }
}
.title {
  font-size: 0.85em;
}
.comment {
  color: grey;
  font-style: italic;
  font-size: 0.85em;
}
.no-of-comments {
  font-size: 0.6em;
}
.category {
  margin-top: 0.5em;
  font-size: 0.85em;
  font-weight: bold;
  font-style: italic;
  color: rgb(0, 179, 179);
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import PhotoTextUser from "@/x-vue/widgets/post/PhotoTextUser.vue";

@Component({
  components: { PhotoTextUser },
})
export default class extends Vue {
  @Prop() ids!: string;
  @Prop({ default: "" }) subcategory!: string;
  @Prop({ default: 60 * 60 * 24 * 7 }) within!: number;
  @Prop({ default: 5 }) limit!: number;
  @Prop({ default: "noOfComments" }) order!: string;

  posts: PostModel[] = [];

  mounted(): void {
    ApiService.instance
      .latestPosts(
        {
          ids: this.ids,
          subcategory: this.subcategory,
          limit: this.limit,
          files: "Y",
          within: this.within,
          order: this.order,
        },
        { callback: (posts) => (this.posts = posts) }
      )
      .then((posts) => (this.posts = posts));
  }
}
</script>
