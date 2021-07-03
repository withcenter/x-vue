<template>
  <div>
    <button class="btn btn-secondary btn-sm mr-2" @click="onEdit">Edit</button>
  </div>
</template>

<script lang="ts">
import { ForumInterface, PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PostEditButton extends Vue {
  @Prop() post!: PostModel;
  onEdit(): void {
    // 글 수정을
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    ((this.$parent as any).forum as ForumInterface).toEdit(this.post);
  }
}
</script>
