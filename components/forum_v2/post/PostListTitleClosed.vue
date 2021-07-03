<template>
  <div class="title" @click="post.toggleView()">
    <div v-if="post.deleted">Post. {{ post.idx }} has been deleted.</div>
    <div v-else>{{ post.idx }} {{ post.title }}</div>
  </div>
</template>
<style lang="scss" scoped>
.title {
  margin: 0.25em 0;
  padding: 1em;
  background-color: aliceblue;
  font-size: 1em;
  font-weight: normal;
  cursor: pointer;
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() post!: PostModel;
}
</script>
