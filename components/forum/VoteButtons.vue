<template>
  <!-- TODO: Move colors to global Css -->
  <div class="d-flex">
    <button class="btn btn-sm" @click="onClickVote('Y')" style="color: green">
      Like
      <span class="badge badge-pill badge-success" v-if="parent.Y">
        {{ parent.Y }}
      </span>
    </button>
    <button
      class="ml-2 btn btn-sm"
      @click="onClickVote('N')"
      style="color: red"
    >
      Dislike
      <span class="badge badge-pill badge-danger" v-if="parent.N">
        {{ parent.N }}
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { CommentModel, PostModel } from "@/x-vue/services/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import { XHelper } from "@/x-vue-helper/x-helper";

@Component({
  props: ["parent"],
})
export default class VoteButtonsComponent extends Vue {
  parent!: PostModel & CommentModel;
  api = ApiService.instance;

  async onClickVote(choice: string): Promise<void> {
    // console.log(choice);
    try {
      const res = await this.api.vote({
        idx: this.parent.idx,
        choice: choice,
      });
      // console.log(res);
      this.parent.updateVoteCount(res);
    } catch (e) {
      XHelper.instance.error(e);
    }
  }
}
</script>
