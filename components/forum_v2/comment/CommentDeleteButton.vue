<template>
  <div>
    <button class="btn btn-secondary btn-sm mr-2" @click="onDelete">delete</button>
  </div>
</template>

<script lang="ts">
import { CommentModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() comment!: CommentModel;
  api = ApiService.instance;

  async onDelete(): Promise<void> {
    const re = await ComponentService.instance.confirm(
      "Comment delete",
      `Are you sure you want to delete this comment? [IDX]: ${this.comment.idx}`
    );
    if (!re) return;
    try {
      await this.api.commentDelete(this.comment.idx);
      this.comment.markDeleted();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
