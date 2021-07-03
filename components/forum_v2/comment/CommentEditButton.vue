<template>
  <div>
    <button class="btn btn-secondary btn-sm mr-2" @click="comment.inEdit = true">edit</button>
  </div>
</template>

<script lang="ts">
import { CommentModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() comment!: CommentModel;
  api = ApiService.instance;
}
</script>
