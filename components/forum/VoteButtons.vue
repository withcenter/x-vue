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
import { AppService } from "@/service/app.service";
import { CommentModel, PostModel } from "@/x-vue/services/interfaces";

@Component({
  props: ["parent"],
})
export default class VoteButtonsComponent extends Vue {
  parent!: PostModel & CommentModel;
  app = AppService.instance;

  async onClickVote(choice: string): Promise<void> {
    // console.log(choice);
    try {
      const res = await this.app.api.vote({
        idx: this.parent.idx,
        choice: choice,
      });
      // console.log(res);
      this.parent.updateVoteCount(res);
    } catch (e) {
      this.app.error(e);
    }
  }
}
</script>
