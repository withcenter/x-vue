<template>
  <h1 @click="post.toggleView()">{{ post.title }}</h1>
</template>
<style lang="scss" scoped>
h1 {
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
