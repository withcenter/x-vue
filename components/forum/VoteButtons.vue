<template>
  <div class="d-flex">
    <button class="btn btn-sm" @click="onClickVote('Y')" style="color: green">
      Like
      <span class="badge badge-pill badge-success" v-if="parent.Y">
        {{ parent.Y }}
      </span>
    </button>
    <button class="ml-2 btn btn-sm" @click="onClickVote('N')" style="color: red">
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
import { ApiService } from "@/x-vue/services/api.service";
import Service from "@/x-vue/services/component.service";
import { CommentModel, PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  props: ["parent"],
})
export default class VoteButtonsComponent extends Vue {
  parent!: PostModel & CommentModel;
  api = ApiService.instance;

  async onClickVote(choice: string): Promise<void> {
    try {
      const res = await this.api.vote({
        idx: this.parent.idx,
        choice: choice,
      });
      this.parent.updateVoteCount(res);
      this.$emit("voted");
    } catch (e) {
      Service.instance.error(e);
    }
  }
}
</script>
