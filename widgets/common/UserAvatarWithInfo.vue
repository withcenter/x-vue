<template>
  <div class="d-flex align-items-center text-nowrap">
    <b-avatar class="mr-1" :src="user.photoUrl"></b-avatar>
    <router-link :to="'/user/' + user.idx">
      <div>({{ user.idx }}) {{ user.nicknameOrName }} <PencilSvg v-if="editIcon"></PencilSvg></div>
      <div>{{ user.email }}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { UserModel } from "@/x-vue/interfaces/interfaces";
import { Component, Vue, Prop } from "vue-property-decorator";

import PencilSvg from "@/x-vue/svg/PencilSvg.vue";
@Component({
  components: {
    PencilSvg,
  },
})
export default class UserAvatarWithInfo extends Vue {
  @Prop({ default: () => new UserModel() }) user!: UserModel;
  @Prop({ default: true }) editIcon!: boolean;
}
</script>
