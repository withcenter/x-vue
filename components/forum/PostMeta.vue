<template>
  <div class="post-meta text-truncate">
    <user-displayname class="mr-2 font-weight-bold" :parent="post" v-if="showName"></user-displayname>
    <span class="mr-2" v-if="!showName">No. {{ post.idx }}</span>
    <span class="text-muted" v-if="post.shortDate">
      {{ post.shortDate }}
    </span>
    <span class="text-muted mr-2" v-if="post.noOfViews"> Views {{ post.noOfViews }} </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UserDisplayname from "@/x-vue/components/forum/UserDisplayName.vue";
import { PostModel } from "@/x-vue/interfaces/forum.interface";

@Component({
  props: ["post", "showName"],
  components: {
    UserDisplayname,
  },
})
export default class PostMetaComponent extends Vue {
  post!: PostModel;
  showName!: boolean;
}
</script>
