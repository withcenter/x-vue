<template>
  <article class="post-preview d-flex" v-if="post">
    <user-avatar :parent="post"></user-avatar>
    <!-- <b-avatar :src="post.user.photoUrl" size="3em"></b-avatar> -->
    <div class="ml-2 d-flex w-100">
      <div class="w-100">
        <router-link :to="toPostView()">
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
import PostMetaComponent from "@/x-vue/components/forum/PostMeta.vue";
import UserAvatar from "@/x-vue/components/forum/UserAvatar.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  props: ["post"],
  components: {
    PostMetaComponent,
    UserAvatar,
  },
})
export default class PostTitleMetaComponent extends Vue {
  post!: PostModel;

  toPostView(): string {
    let link = this.post.relativeUrl || `/${this.post.idx}`;
    if (this.$route.query.sc) {
      link += "?sc=" + this.$route.query.sc;
    }
    return link;
  }
}
</script>
