<template>
  <div class="comment-preview p-3 rounded" style="background-color: #f0f0f0">
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
    <div class="mt-2">{{ comment.content }}</div>
    <file-display :files="comment.files"></file-display>
    <hr class="my-2" />
    <router-link
      class="d-flex justify-content-between btn btn-outline-info w-100"
      :to="`/${comment.rootIdx}`"
    >
      Open Post
      <img src="@/assets/svg/external-link.svg" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { CommentModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import UserAvatar from "@/components/forum/UserAvatar.vue";
import UserDisplayName from "@/components/forum/UserDisplayName.vue";
import FileDisplay from "@/components/forum/FileDisplay.vue";

@Component({
  props: ["comment"],
  components: {
    UserAvatar,
    UserDisplayName,
    FileDisplay,
  },
})
export default class CommentPreview extends Vue {
  comment!: CommentModel;
}
</script>
