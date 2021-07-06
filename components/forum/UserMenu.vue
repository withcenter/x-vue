<template>
  <div class="user-menu">
    <!-- <a type="button" class="btn w-100" @click="$emit('menuClick', 'profile')">
      {{ "see_profile" | t }}
    </a>
    <a type="button" class="btn w-100" @click="$emit('menuClick', 'posts')">
      {{ "see_posts" | t }}
    </a>
    <a type="button" class="btn w-100" @click="$emit('menuClick', 'comments')">
      {{ "see_comments" | t }}
    </a>
    <a type="button" class="btn w-100" @click="$emit('menuClick', 'message')">
      {{ "send_message" | t }}
    </a> -->

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
