<template>
  <div>
    <button class="btn btn-secondary btn-sm mr-2" @click="onDelete">Delete</button>
  </div>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/x-vue.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PostDeleteButton extends Vue {
  @Prop() post!: PostModel;
  async onDelete(): Promise<void> {
    try {
      const re = await ComponentService.instance.confirm(
        "Post delete",
        "Do you want to delete this post?"
      );
      if (re === false) return;
      await ApiService.instance.postDelete(this.post.idx);
      this.post.markDeleted();
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
