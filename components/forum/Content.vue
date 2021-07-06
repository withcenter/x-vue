<template>
  <div class="content" v-if="parent.content">{{ parent.content }}</div>
</template>

<style lang="scss" scoped>
.content {
  white-space: pre;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  props: ["parent"],
})
export default class Content extends Vue {
  parent!: PostModel | CommentModel;
}
</script>
