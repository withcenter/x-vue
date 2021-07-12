<template>
  <div class="comment-preview p-3 rounded" style="background-color: #f0f0f0">
    <div v-if="!comment.deletedAt">
      <div class="d-flex">
        <user-avatar :parent="comment" :size="2.8"></user-avatar>
        <div class="ml-2 text-truncate">
          <user-display-name class="font-weight-bold" :parent="comment"></user-display-name>
          <div>No. {{ comment.idx }} • {{ comment.shortDate }}</div>
        </div>
      </div>
      <div class="mt-2">{{ comment.content }}</div>
      <FileList :post="comment"></FileList>
    </div>
    <div v-if="comment.deletedAt">{{ "comment_deleted" | t }}</div>
    <hr class="my-2" />
    <router-link class="d-flex justify-content-between btn btn-outline-info w-100" :to="`/${comment.rootIdx}`">
      Open Post
      <ExternalLinkSvg class="icon-md"></ExternalLinkSvg>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserAvatar from "@/x-vue/components/forum/ForumUserAvatar.vue";
import UserDisplayName from "@/x-vue/components/forum/UserDisplayName.vue";
import FileList from "@/x-vue/components/file/FileList.vue";

import { CommentModel } from "@/x-vue/interfaces/forum.interface";
import ExternalLinkSvg from "@/x-vue/svg/ExternalLinkSvg.vue";

@Component({
  props: ["comment"],
  components: {
    UserAvatar,
    UserDisplayName,
    FileList,
    ExternalLinkSvg,
  },
})
export default class CommentPreview extends Vue {
  comment!: CommentModel;
}
</script>
