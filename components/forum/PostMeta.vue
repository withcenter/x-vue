<template>
  <div class="post-meta d-flex text-truncate">
    <user-displayname
      class="mr-2 font-weight-bold"
      :parent="post"
      v-if="showName"
    ></user-displayname>
    <span class="mr-2" v-if="!showName">No. {{ post.idx }}</span>
    <span class="text-muted mr-2" v-if="post.categoryIdx">
      • Category {{ post.categoryIdx }}
    </span>
    <span class="text-muted mr-2" v-if="post.noOfComments">
      • Comments {{ post.noOfComments }}
    </span>
    <span class="text-muted mr-2" v-if="post.noOfViews">
      • Views {{ post.noOfViews }}
    </span>
    <span class="text-muted" v-if="post.shortDate">
      • Date: {{ post.shortDate }}
    </span>
  </div>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";
import UserDisplayname from "@/x-vue/components/forum/UserDisplayName.vue";

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
