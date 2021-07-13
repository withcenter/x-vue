<template>
  <div class="admin-user-avatar d-flex align-items-center text-nowrap">
    <UserAvatar :user="user"></UserAvatar>
    <div>
      <div>({{ user.idx }}) {{ user.nicknameOrName }}</div>
      <div class="d-flex">
        <router-link class="px-2" :to="'/user/' + user.idx">
          <div><BoxArrowUpRightSvg v-if="profileIcon"></BoxArrowUpRightSvg></div>
        </router-link>
        <router-link class="px-2" :to="'/admin/user/edit/' + user.idx">
          <div><PencilSvg v-if="editIcon"></PencilSvg></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
.admin-user-avatar .avatar {
  width: 2.5rem !important;
  height: 2.5rem !important;
}
</style>

<script lang="ts">
import { UserModel } from "@/x-vue/interfaces/interfaces";
import { Component, Vue, Prop } from "vue-property-decorator";

import PencilSvg from "@/x-vue/svg/PencilSvg.vue";
import BoxArrowUpRightSvg from "@/x-vue/svg/BoxArrowUpRightSvg.vue";

import UserAvatar from "@/x-vue/components/user/UserAvatar.vue";
@Component({
  components: {
    PencilSvg,
    BoxArrowUpRightSvg,
    UserAvatar,
  },
})
export default class UserAvatarWithInfo extends Vue {
  @Prop({ default: () => new UserModel() }) user!: UserModel;
  @Prop({ default: true }) editIcon!: boolean;
  @Prop({ default: true }) profileIcon!: boolean;
}
</script>
