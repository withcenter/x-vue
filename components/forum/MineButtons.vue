<template>
  <div class="mine-buttons">
    <button :id="'mine-button-popover-' + parent.idx" class="btn btn-sm">
      <img class="icon-v grey" src="@/assets/svg/ellipsis-v.svg" />
    </button>

    <b-popover
      placement="bottomleft"
      ref="popover"
      :target="'mine-button-popover-' + parent.idx"
      triggers="click blur"
    >
      <button
        class="btn btn-sm btn-success"
        @click="onClickEmit('on-click-edit')"
      >
        Edit
      </button>
      <button
        class="ml-2 btn btn-sm btn-danger"
        @click="onClickEmit('on-click-delete')"
      >
        Delete
      </button>
    </b-popover>
  </div>
</template>

<script lang="ts">
import { CommentModel, PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["parent"],
})
export default class MineButtonsComponent extends Vue {
  parent!: PostModel & CommentModel;

  onClickEmit(a: string): void {
    this.$emit(a);
    this.$root.$emit(
      "bv::hide::popover",
      "mine-button-popover-" + this.parent.idx
    );
  }
}
</script>
