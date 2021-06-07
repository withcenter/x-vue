<template>
  <div class="user-menu">
    <router-link
      class="btn d-block text-left"
      :to="`/user/profile/${user.idx}`"
    >
      @Todo: See user profile
    </router-link>
    <router-link class="btn d-block text-left" :to="`/user/posts/${user.idx}`">
      See user posts
    </router-link>
    <router-link
      class="btn d-block text-left"
      :to="`/user/comments/${user.idx}`"
    >
      See user comments
    </router-link>
    <router-link class="btn d-block text-left" :to="`/message/${user.idx}`">
      @Todo: Send message
    </router-link>
  </div>
</template>

<script lang="ts">
import { UserModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["user"],
})
export default class UserMenu extends Vue {
  user!: UserModel;
}
</script>
