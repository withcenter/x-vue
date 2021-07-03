<template>
  <div>
    <div v-for="file in post.files" :key="file.idx">
      <img class="mw-100" :src="file.url" />
    </div>
  </div>
</template>
<script lang="ts">
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class FileList extends Vue {
  @Prop({ default: () => new PostModel() }) post!: PostModel | CommentModel;
}
</script>
