<template>
  <div>
    {{ "content" | t }}
    <div class="form-group">
      <textarea class="w-100 form-control" ref="textarea" v-model="$parent.forum.post.content" />
    </div>
  </div>
</template>
<script lang="ts">
import autosize from "autosize";
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class extends Vue {
  $refs!: {
    textarea: HTMLInputElement;
  };
  mounted(): void {
    autosize(this.$refs.textarea);
  }
}
</script>
