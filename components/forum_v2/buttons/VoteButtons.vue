<template>
  <div>
    <button class="btn btn-secondary btn-sm mr-2" @click="post.like()">Like {{ post.Y }}</button>
    <button class="btn btn-secondary btn-sm mr-2" @click="post.dislike()">
      Dislike {{ post.N }}
    </button>
  </div>
</template>
<script lang="ts">
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class VoteButtons extends Vue {
  @Prop() post!: PostModel | CommentModel;
}
</script>
