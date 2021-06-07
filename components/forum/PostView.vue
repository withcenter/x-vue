<template>
  <article class="post-view px-2 py-4">
    <!-- title -->
    <h3>{{ post.title }}</h3>
    <!-- avatar + meta -->
    <div class="d-flex">
      <user-avatar :parent="post"></user-avatar>
      <div class="ml-2">
        <user-display-name
          class="font-weight-bold"
          :parent="post"
        ></user-display-name>
        <post-meta-component :post="post"></post-meta-component>
      </div>
    </div>
    <!-- content - TODO move css to global -->
    <div
      class="mt-3 p-2 rounded"
      style="background-color: #f1f1f1; white-space: break-space"
    >
      {{ post.content }}
    </div>
    <!-- Files -->
    <file-display class="mt-2" :files="post.files"></file-display>
    <hr class="my-3" />
    <!-- buttons -->
    <div class="d-flex">
      <!-- vote buttons -->
      <vote-buttons-component :parent="post"></vote-buttons-component>
      <span class="flex-grow-1"></span>
      <!-- mine buttons -->
      <mine-buttons-component
        :parent="post"
        v-if="app.api.isMine(post)"
        @on-click-edit="onClickEdit()"
        @on-click-delete="onClickDelete(post.idx)"
      ></mine-buttons-component>
    </div>
    <!-- comment form -->
    <comment-form-component
      class="mt-2"
      :parent="post"
      :root="post"
    ></comment-form-component>
    <!-- comments -->
    <div class="comments" v-if="post.comments.length">
      <hr class="m-2" />
      <div class="text-muted px-2 mb-3">
        {{ post.comments.length }} comments
      </div>
      <div
        class="mt-2"
        v-for="comment of post.comments"
        :key="comment.idx"
        :style="{ 'margin-left': comment.depth * 8 + 'px' }"
      >
        <comment-view-component
          :post="post"
          :comment="comment"
        ></comment-view-component>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { PostModel } from "@/x-vue/services/interfaces";
import { AppService } from "@/service/app.service";
import CommentFormComponent from "@/x-vue/components/user/forum/CommentForm.vue";
import CommentViewComponent from "@/x-vue/components/user/forum/CommentView.vue";
import PostMetaComponent from "@/x-vue/components/user/forum/PostMeta.vue";
import VoteButtonsComponent from "@/x-vue/components/user/forum/VoteButtons.vue";
import MineButtonsComponent from "@/x-vue/components/user/forum/MineButtons.vue";
import UserDisplayName from "@/x-vue/components/user/forum/UserDisplayName.vue";
import UserAvatar from "@/x-vue/components/user/forum/UserAvatar.vue";
import FileDisplay from "@/x-vue/components/user/forum/FileDisplay.vue";

@Component({
  props: ["post"],
  components: {
    CommentFormComponent,
    CommentViewComponent,
    PostMetaComponent,
    VoteButtonsComponent,
    MineButtonsComponent,
    UserDisplayName,
    UserAvatar,
    FileDisplay,
  },
}) // without this, Vue lifecycle methods will not be invoked
export default class PostViewComponent extends Vue {
  post!: PostModel;

  app = AppService.instance;

  async onClickDelete(): Promise<void> {
    const conf = confirm(
      `Are you sure you want to delete this post? [IDX]: ${this.post.idx}`
    );
    if (!conf) return;
    try {
      await this.app.api.postDelete(this.post?.idx);
      this.$emit("post-deleted", this.post?.idx);
    } catch (e) {
      this.app.error(e);
    }
  }

  onClickEdit(): void {
    // console.log("onEdit", `/edit/${this.post.idx}`);
    this.$router.push(`/edit/${this.post.idx}`).catch(() => null);
  }
}
</script>
