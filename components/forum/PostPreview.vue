<template>
  <article class="post-preview d-flex" v-if="post">
    <user-avatar :parent="post"></user-avatar>
    <!-- <b-avatar :src="post.user.photoUrl" size="3em"></b-avatar> -->
    <div class="ml-2 text-truncate">
      <router-link :to="post.relativeUrl || `/${post.idx}`"
        >No. {{ post.idx }} - {{ post.title || "no title" }}</router-link
      >
      <post-meta-component :showName="true" :post="post"></post-meta-component>
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
export default class PostPreviewComponent extends Vue {
  post: PostModel | undefined;
}
</script>
