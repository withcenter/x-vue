<template>
  <div class="mine-buttons" v-if="api.isMine(parent)">
    <button data-cy="mine-button" :id="'mine-button-popover-' + parent.idx" class="btn btn-sm">
      <img class="icon-v grey" src="@/assets/svg/ellipsis-v.svg" />
    </button>

    <b-popover placement="bottomleft" ref="popover" :target="'mine-button-popover-' + parent.idx" triggers="click blur">
      <button data-cy="mine-edit-button" class="btn btn-sm btn-success" @click="onClickEdit">Edit</button>
      <button data-cy="mine-delete-button" class="ml-2 btn btn-sm btn-danger" @click="onClickDelete">Delete</button>
    </b-popover>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ApiService } from "@/x-vue/services/api.service";
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  props: ["parent"],
})
export default class MineButtonsComponent extends Vue {
  parent!: PostModel & CommentModel;
  api = ApiService.instance;

  hidePopup(): void {
    this.$root.$emit("bv::hide::popover", "mine-button-popover-" + this.parent.idx);
  }
  onClickEdit(): void {
    this.hidePopup();
    this.$emit("edit", this.parent);
  }

  async onClickDelete(): Promise<void> {
    this.hidePopup();
    this.$emit("delete", this.parent);
  }
}
</script>
