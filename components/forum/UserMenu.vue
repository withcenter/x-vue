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

    <div class="pointer" @click="loginFirst" v-if="api.notLoggedIn">{{ "chat" | t }}</div>
    <div class="pointer" @click="emptyFirebaseUid" v-else-if="!user.firebaseUid">{{ "chat" | t }}</div>
    <router-link class="d-block text-left" :to="`/chat-message?firebaseUid=${user.firebaseUid}`" v-else>{{
      "chat" | t
    }}</router-link>
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
.pointer {
  cursor: pointer;
}
</style>
<script lang="ts">
import { UserModel } from "@/x-vue/interfaces/interfaces";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import { Err } from "@/x-vue/services/defines";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["user"],
})
export default class UserMenu extends Vue {
  user!: UserModel;
  api = ApiService.instance;
  emptyFirebaseUid(): void {
    ComponentService.instance.error("error_cant_chat_due_to_empty_firebase_uid");
  }
  loginFirst(): void {
    ComponentService.instance.error(Err.login_first);
  }
}
</script>
