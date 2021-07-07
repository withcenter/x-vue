<template>
  <div>
    <div v-for="file in post.files" :key="file.idx">
      <img class="mw-100" :src="file.url" />
    </div>
  </div>
</template>
<script lang="ts">
/**
 * 글의 사진을 화면에 보여준다.
 *
 * 글 내용 또는 코멘트 내용에서 사용 할 수 있다.
 */
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class FileList extends Vue {
  @Prop({ default: () => new PostModel() }) post!: PostModel | CommentModel;
}
</script>
