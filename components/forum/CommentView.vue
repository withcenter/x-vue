<template>
  <section>
    <div class="comment-view p-3 rounded" style="background-color: #f0f0f0">
      <div class="d-flex">
        <user-avatar :parent="comment" :size="2.8"></user-avatar>
        <div class="ml-2 text-truncate">
          <user-display-name
            class="font-weight-bold"
            :parent="comment"
          ></user-display-name>
          <div>No. {{ comment.idx }} • {{ comment.shortDate }}</div>
        </div>
      </div>
      <div class="w-100" v-if="!comment.inEdit">
        <!-- comment content -->
        <div class="mt-2">{{ comment.content }}</div>
        <!-- comment files -->
        <file-display :files="comment.files"></file-display>
        <!-- comment edit mode -->
      </div>
      <comment-form-component
        v-if="comment.inEdit"
        :root="post"
        :comment="comment"
      ></comment-form-component>
      <!-- comment buttons -->
      <hr class="my-2" />
      <div class="mt-2 d-flex" v-if="!comment.inEdit">
        <div class="d-flex">
          <button
            class="mr-2 btn btn-sm"
            @click="comment.inReply = !comment.inReply"
          >
            Reply
          </button>
          <vote-buttons-component :parent="comment"></vote-buttons-component>
        </div>
        <span class="flex-grow-1"></span>
        <!-- mine buttons -->
        <mine-buttons-component
          :parent="comment"
          v-if="api.isMine(comment)"
          @on-click-edit="comment.inEdit = !comment.inEdit"
          @on-click-delete="onClickDelete"
        ></mine-buttons-component>
      </div>
    </div>

    <!-- comment reply form -->
    <comment-form-component
      :root="post"
      :parent="comment"
      v-if="comment.inReply"
    ></comment-form-component>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { CommentModel, PostModel } from "@/x-vue/services/interfaces";
import CommentFormComponent from "./CommentForm.vue";
import VoteButtonsComponent from "./VoteButtons.vue";
import MineButtonsComponent from "./MineButtons.vue";
import UserDisplayName from "./UserDisplayName.vue";
import UserAvatar from "./UserAvatar.vue";
import FileDisplay from "./FileDisplay.vue";
import { ApiService } from "@/x-vue/services/api.service";

@Component({
  props: ["post", "comment"],
  components: {
    CommentFormComponent,
    VoteButtonsComponent,
    MineButtonsComponent,
    UserDisplayName,
    UserAvatar,
    FileDisplay,
  },
})
export default class CommentView extends Vue {
  post!: PostModel;
  comment!: CommentModel;

  api = ApiService.instance;

  async onClickDelete(): Promise<void> {
    const conf = confirm(
      `Are you sure you want to delete this comment? [IDX]: ${this.post.idx}`
    );
    if (!conf) return;
    try {
      await this.api.commentDelete(this.comment?.idx);
      this.post.deleteComment(this.comment.idx);
    } catch (e) {
      this.api.error(e);
    }
  }
}
</script>
