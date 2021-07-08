<template>
  <div>{{ post.title }}</div>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  components: {},
})
export default class Samples extends Vue {
  @Prop({
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;
}
</script>
