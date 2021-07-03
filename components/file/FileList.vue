<template>
  <div>
    <div v-for="file in post.files" :key="file.idx">
      <img class="mw-100" :src="file.url" />
    </div>
  </div>
</template>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/interfaces";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class FileList extends Vue {
  @Prop({ default: new PostModel() }) post!: PostModel;
}
</script>
