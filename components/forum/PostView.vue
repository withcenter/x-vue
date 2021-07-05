<template>
  <div>
    <article data-cy="post-view" class="post-view px-2 py-4" v-if="post.idx && !loading">
      <!-- title -->
      <div class="d-flex justify-content-between">
        <h3 id="post-title">{{ post.title }}</h3>
        <router-link class="btn btn-outline-info" :to="toListPage">
          {{ "back_to_list" | t }}
        </router-link>
      </div>
      <!-- avatar + meta -->
      <div class="d-flex">
        <user-avatar :parent="post"></user-avatar>
        <div class="ml-2">
          <user-display-name class="font-weight-bold" :parent="post"></user-display-name>
          <post-meta-component data-cy="post-view-meta" :post="post"></post-meta-component>
        </div>
      </div>
      <!-- content - TODO move css to global -->
      <div class="mt-2" v-if="post.deletedAt">
        {{ "post_deleted" | t }}
      </div>
      <div
        id="post-content"
        class="mt-3 p-2 rounded"
        style="background-color: #f1f1f1; white-space: break-space"
        v-if="!post.deletedAt"
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
        <router-link class="btn btn-sm btn-info mr-2" :to="toListPage">
          {{ "back_to_list" | t }}
        </router-link>
        <mine-buttons-component :parent="post"></mine-buttons-component>
      </div>
      <!-- comment form -->
      <comment-form-component
        data-cy="post-comment-form"
        class="mt-2"
        :parent="post"
        :root="post"
        @edited="$emit('edited', $event)"
      ></comment-form-component>
      <!-- comments -->
      <div class="comments" v-if="post.comments.length">
        <hr class="m-2" />
        <div class="text-muted px-2 mb-3">{{ post.comments.length }} comments</div>
        <div
          class="mt-2"
          v-for="(comment, index) of post.comments"
          :key="comment.idx"
          :style="{ 'margin-left': comment.depth * 8 + 'px' }"
        >
          <comment-view-component
            :data-cy="'comment-' + index"
            :post="post"
            :comment="comment"
            @edited="$emit('edited', $event)"
          ></comment-view-component>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <router-link class="btn btn-outline-info" :to="toListPage">
          {{ "back_to_list" | t }}
        </router-link>
      </div>
    </article>
    <div class="p-3 text-center rounded" v-if="loading">
      <b-spinner small class="mx-2" type="grow" variant="info"></b-spinner>
      Please wait while loading the post ...
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { RequestData } from "@/x-vue/interfaces/interfaces";
import CommentFormComponent from "@/x-vue/components/forum/CommentForm.vue";
import CommentViewComponent from "@/x-vue/components/forum/CommentView.vue";
import PostMetaComponent from "@/x-vue/components/forum/PostMeta.vue";
import VoteButtonsComponent from "@/x-vue/components/forum/VoteButtons.vue";
import MineButtonsComponent from "@/x-vue/components/forum/MineButtons.vue";
import UserDisplayName from "@/x-vue/components/forum/UserDisplayName.vue";
import UserAvatar from "@/x-vue/components/forum/UserAvatar.vue";
import FileDisplay from "@/x-vue/components/forum/FileDisplay.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
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
export default class PostView extends Vue {
  post: PostModel = new PostModel();
  loading = false;

  async mounted(): Promise<void> {
    console.log("PostView::mounted::");
    this.loading = true;

    const arr = location.href.split("/");
    const last = arr[arr.length - 1];
    const options: RequestData = {
      idx: last,
    };

    try {
      this.post = await this.$app.api.postGet(options);
      // this.$store.commit("currentCategory", this.post.categoryId);
      this.$emit("post", this.post);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.$app.error(e);
    }
  }

  get toListPage(): string {
    return "forum/" + this.post.categoryId + location.search;
  }
}
</script>
