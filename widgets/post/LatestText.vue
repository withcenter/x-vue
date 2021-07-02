<template>
  <div>
    <div>{{ post.title }}</div>
  </div>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Samples extends Vue {
  @Prop({
    default: () => {
      return new PostModel().fromJson({
        title: "This is the default post title text.",
      });
    },
  })
  post!: PostModel;
}
</script>
