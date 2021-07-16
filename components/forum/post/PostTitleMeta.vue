<template>
  <article class="post-preview" v-if="post">
    <div class="d-flex align-items-center" v-if="!post.deletedAt">
      <user-avatar :parent="post"></user-avatar>
      <!-- <b-avatar :src="post.user.photoUrl" size="3em"></b-avatar> -->
      <div class="ml-2 d-flex align-items-center w-100">
        <div class="flex-grow-1">
          <router-link :to="toPostView()">
            <div class="d-flex">
              <div class="title line-1">{{ post.title || "no title" }}</div>
              <div>
                <b-badge class="ml-1" v-if="post.noOfComments"> {{ post.noOfComments }} </b-badge>
              </div>
            </div>
            <div>
              <i class="comment text-muted" v-if="post.comments.length">
                {{ post.comments[0].user.displayName }}: "{{ post.comments[0].content }}"
              </i>
              <i class="no-comment-yet text-muted" v-else>{{ "no_comment_yet" | t }}</i>
            </div>
          </router-link>
        </div>
        <post-meta-component
          class="ml-1 d-block"
          style="width: 120px"
          :showName="true"
          :post="post"
        ></post-meta-component>
      </div>
    </div>
    <div v-if="post.deletedAt">
      {{ "post_deleted" | t }}
    </div>
    <hr />
  </article>
</template>

<style lang="scss" scoped>
.line-1 {
  line-height: 1em;
  height: 1em;
  overflow: hidden;
}
</style>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import UserAvatar from "@/x-vue/components/forum/ForumUserAvatar.vue";
import PostMetaComponent from "@/x-vue/components/forum/post/PostMeta.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

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
    return (this.post.relativeUrl || `/${this.post.idx}`) + location.search;
  }
}
</script>
