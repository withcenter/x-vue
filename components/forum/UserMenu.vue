<template>
  <div class="user-menu">
    <div class="not-verified" v-if="user.verified == false">미인증 회원</div>

    <div>{{ user.displayName }}</div>

    <router-link class="d-block text-left" :to="`/user/${user.idx}`" v-if="user.verified">{{ user.name }}</router-link>
    <router-link class="d-block text-left" :to="`/user/${user.idx}`" v-if="user.verified"
      >{{ user.age }}세 / {{ user.gender | t }}</router-link
    >
    <div class="">Lv. {{ user.level }}</div>
    <hr />
    <router-link class="d-block text-left" :to="`/user/${user.idx}`">{{ "see_profile" | t }}</router-link>
    <router-link class="d-block text-left" :to="`/user/posts/${user.idx}`">{{ "see_posts" | t }}</router-link>
    <router-link class="d-block text-left" :to="`/user/comments/${user.idx}`">{{ "see_comments" | t }}</router-link>
    <router-link class="d-block text-left" :to="`/message/${user.idx}`">{{ "send_message" | t }}</router-link>
  </div>
</template>
<style lang="scss" scoped>
.not-verified {
  margin: 0.5em 0;
  font-size: 0.85em;
  font-weight: 200;
  color: rgb(165, 122, 90);
}
hr {
  margin: 0;
  padding: 0;
}
a {
  padding: 0.3em 0 0.2em;
}
</style>
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
