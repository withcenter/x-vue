<template>
  <div>
    <article>{{ comment.idx }}. {{ comment.content }}</article>
  </div>
</template>

<script lang="ts">
import { CommentModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() comment!: CommentModel;
}
</script>
