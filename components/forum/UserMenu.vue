<template>
  <div class="user-menu">
    <div v-if="user.verified == false">본인 미 인증</div>

    <router-link class="btn d-block text-left" :to="`/profile/${user.idx}`" v-if="user.verified">{{
      user.name
    }}</router-link>
    <router-link class="btn d-block text-left" :to="`/profile/${user.idx}`" v-if="user.verified"
      >{{ user.age }}세 / {{ user.gender | t }}</router-link
    >
    <hr />
    <router-link class="btn d-block text-left" :to="`/profile/${user.idx}`">{{ "see_profile" | t }}</router-link>
    <router-link class="btn d-block text-left" :to="`/user/posts/${user.idx}`">{{ "see_posts" | t }}</router-link>
    <router-link class="btn d-block text-left" :to="`/user/comments/${user.idx}`">{{ "see_comments" | t }}</router-link>
    <router-link class="btn d-block text-left" :to="`/message/${user.idx}`">{{ "send_message" | t }}</router-link>
  </div>
</template>

<script lang="ts">
import { UserModel } from "@/x-vue/interfaces/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["user"],
})
export default class UserMenu extends Vue {
  user!: UserModel;
}
</script>
