<template>
  <router-link :to="post.relativeUrl" class="d-flex">
    <b-img class="image col-3 p-0" :src="src"></b-img>
    <div class="text-meta col-9">
      <div class="category">{{ post.categoryId }}</div>
      <div class="title text-truncate">{{ post.title }}</div>
      <div class="content">{{ post.content }}</div>
      <div class="author">
        <span>{{ post.user.nicknameOrName }}</span>
        <span class="text-muted"> ∙ {{ post.shortDate }}</span>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.image {
  height: 130px;
}

.text-meta {
  padding: 0 0 0 0.5em;
}

.category {
  font-weight: 700;
  color: rgb(2, 174, 2);
}
.title {
  margin-top: 0.25em;
  font-weight: 700;
}
.content {
  margin-top: 0.25em;
  height: 3em;
  overflow: hidden;
  font-weight: 500;
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextAndMeta extends Vue {
  @Prop({
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  get src(): string {
    if (!this.post.files.length) return "";
    else return this.post.files[0].url;
  }
}
</script>
