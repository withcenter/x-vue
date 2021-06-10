<template>
  <div class="mine-buttons">
    <button
      data-cy="mine-button"
      :id="'mine-button-popover-' + parent.idx"
      class="btn btn-sm"
    >
      <img class="icon-v grey" src="@/assets/svg/ellipsis-v.svg" />
    </button>

    <b-popover
      placement="bottomleft"
      ref="popover"
      :target="'mine-button-popover-' + parent.idx"
      triggers="click blur"
    >
      <button
        data-cy="mine-edit-button"
        class="btn btn-sm btn-success"
        @click="onClickEdit"
      >
        Edit
      </button>
      <button
        data-cy="mine-delete-button"
        class="ml-2 btn btn-sm btn-danger"
        @click="onClickEmit('on-click-delete')"
      >
        Delete
      </button>
    </b-popover>
  </div>
</template>

<script lang="ts">
import { CommentModel, PostModel } from "../../services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import store from "@/store";

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

  hidePopup(): void {
    this.$root.$emit(
      "bv::hide::popover",
      "mine-button-popover-" + this.parent.idx
    );
  }
  onClickEdit(): void {
    this.hidePopup();
    store.commit("postEdit", this.parent);
  }
}
</script>
