<template>
  <div>
    <router-link class="post d-flex mt-3 round" :to="post.relativeUrl">
      <div class="photo"><img :src="src" /></div>
      <div class="fs-sm ml-3 mt-1 overflow-hidden">
        <div class="title d-flex">
          <div class="bold">{{ post.title }}</div>
          <div class="noOfComments" v-if="post.noOfComments">
            <b-badge class="d-flex ml-1">{{ post.noOfComments }}</b-badge>
          </div>
        </div>
        <div class="content text-truncate">{{ post.content }}</div>
        <div class="fs-sm grey italic">{{ post.categoryId | t }}</div>

        <div class="mt-2 d-flex">
          <UserAvatar :user="post.user"></UserAvatar>
          <div>
            <div class="ml-3">{{ post.user.displayName }}</div>
            <div class="mt-1 ml-3">Lv. {{ post.user.level }}</div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.post {
  .noOfComments {
    margin-top: 0.15em;
  }
  .photo {
    flex-basis: 180px;
    flex-shrink: 0;
    flex-grow: 0;
    overflow: hidden;
    height: 120px;
    img {
      width: 100%;
    }
  }
}
</style>
<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";

@Component({
  components: { UserAvatar },
})
export default class extends Vue {
  @Prop() post!: PostModel;

  get src(): string {
    return ApiService.instance.thumbnailUrl(this.post.files[0].idx, 180, 120, 100);
  }
}
</script>
