<template>
  <article class="post-preview d-flex" v-if="post">
    <user-avatar :parent="post"></user-avatar>
    <!-- <b-avatar :src="post.user.photoUrl" size="3em"></b-avatar> -->
    <div class="ml-2 d-flex w-100">
      <div class="w-100">
        <router-link :to="post.relativeUrl || `/${post.idx}`">
          <span>No. {{ post.idx }} - </span>
          <span data-cy="post-title">{{ post.title || "no title" }}</span>
          <span class="ml-1" v-if="post.noOfComments">
            ({{ post.noOfComments }})
          </span>
        </router-link>
        <div>
          <i class="text-muted" v-if="post.comments.length">
            {{ post.comments[0].user.displayName }}: "{{
              post.comments[0].content
            }}"
          </i>
          <i class="text-muted" v-if="!post.comments.length">
            No comments yet ..
          </i>
        </div>
      </div>
      <post-meta-component
        class="d-block"
        style="width: 120px"
        :showName="true"
        :post="post"
      ></post-meta-component>
    </div>
  </article>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import PostMetaComponent from "@/x-vue/components/forum/PostMeta.vue";
import UserAvatar from "@/x-vue/components/forum/UserAvatar.vue";

@Component({
  props: ["post"],
  components: {
    PostMetaComponent,
    UserAvatar,
  },
})
export default class PostTitleMetaComponent extends Vue {
  post: PostModel | undefined;
}
</script>
