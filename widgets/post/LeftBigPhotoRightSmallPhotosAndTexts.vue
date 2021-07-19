<template>
  <section>
    <div class="row round" v-if="posts.length">
      <div class="col-6">
        <!-- 왼쪽 큰 사진 -->
        <div class="left-top" v-if="posts[0]">
          <h1 class="title two-line-truncate">{{ posts[0].title }}</h1>
          <div class="content text-truncate">{{ posts[0].content }}</div>
          <img class="mt-1 w-100" :src="api.thumbnailUrl(posts[0].files[0].idx, 400, 300)" />
        </div>
        <!-- 왼쪽 글 5 개 -->
        <div class="bottom-latest mt-3" v-if="leftStories.length">
          <router-link
            class="line d-flex align-items-center"
            :to="post.relativeUrl"
            v-for="post of leftStories"
            :key="post.idx"
          >
            <div class="text-truncate">• {{ post.title }}</div>

            <div class="d-flex ml-2">
              <b-badge class="noOfComments" variant="light">{{ post.noOfComments }}</b-badge>
            </div>
          </router-link>
        </div>
      </div>
      <div class="col-6">
        <!-- 오른쪽 썸네일 텍스트 -->
        <div class="stories" v-if="stories.length">
          <router-link class="d-flex align-items-center" :to="post.relativeUrl" v-for="post of stories" :key="post.idx">
            <img :src="post.files[0].thumbnailUrl" />
            <div>
              <h1 class="title pl-2 normal overflow-hidden two-line-truncate">
                {{ post.title }}
              </h1>
              <div class="meta mt-3 pl-2">{{ post.shortDate }}</div>
            </div>
          </router-link>
        </div>
        <!-- 오른쪽 한 줄 -->
        <div class="mt-3" v-if="posts[4]">
          <router-link class="line-news d-block text-truncate border-top border-bottom" :to="posts[4].relativeUrl">
            {{ posts[4].title }}
          </router-link>
        </div>
        <!-- 오른쪽 글 5 개 -->
        <div class="bottom-latest mt-3" v-if="rightStories.length">
          <router-link
            class="line d-flex align-items-center"
            :to="post.relativeUrl"
            v-for="post of rightStories"
            :key="post.idx"
          >
            <div class="text-truncate">• {{ post.title }}</div>

            <div class="d-flex ml-2">
              <b-badge class="noOfComments" variant="light">{{ post.noOfComments }}</b-badge>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
// 두 줄 이상의 텍스트에서 truncate 지원. 95% 이상의 브라우저 지원.
// line-clamp: 2 를 수정하여 몇 라인 지정.
.two-line-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.noOfComments {
  font-size: 0.6em;
}

.line {
  display: block;
  padding: 0.5em 0;
  line-height: 2em;
  height: 2em;
  font-size: 1em;
  overflow: hidden;
}

.normal {
  margin: 0;
  padding: 0;
  font-size: 1em;
}
.left-top {
  .title {
    line-height: 1.5em;
    max-height: 3em;
    overflow: hidden;
    font-size: 1.5em;
    text-align: center;
  }
}
.stories {
  a {
    display: block;
    margin-top: 0.75em;
    img {
      width: 100px;
    }
    .title {
      line-height: 1.25em;
      max-height: 2.5em;
    }
    .meta {
      font-size: 0.85em;
      font-style: italic;
      color: rgb(125, 125, 125);
    }
  }
}

.line-news {
  padding: 0.9em 0.5em;
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() categoryId!: string;
  api = ApiService.instance;
  posts: PostModel[] = [];
  get stories(): PostModel[] {
    return this.posts.slice(1, 4);
  }
  get leftStories(): PostModel[] {
    return this.posts.slice(5, 10);
  }
  get rightStories(): PostModel[] {
    return this.posts.slice(10, 15);
  }
  async mounted(): Promise<void> {
    try {
      this.posts = await this.api.latestPosts({ categoryId: this.categoryId, files: "Y", limit: 15 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
