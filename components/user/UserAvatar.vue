<template>
  <section class="user-avatar pointer" @click="onClick">
    <div v-if="user.photoUrl == '' && user.gender">
      <ManSvg class="avatar" v-if="user.gender == 'M'"></ManSvg>
      <WomanSvg class="avatar" v-if="user.gender == 'F'"></WomanSvg>
    </div>
    <b-avatar class="avatar" v-else :src="user.photoUrl"></b-avatar>
  </section>
</template>

<style lang="scss" scoped>
.avatar {
  width: 3rem;
  height: 3rem;
}
</style>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ManSvg from "@/x-vue/svg/ManSvg.vue";
import WomanSvg from "@/x-vue/svg/WomanSvg.vue";
import { UserModel } from "@/x-vue/interfaces/interfaces";
import router from "@/router";

@Component({
  components: {
    ManSvg,
    WomanSvg,
  },
})
export default class extends Vue {
  @Prop() user!: UserModel;
  @Prop({ default: "" }) to!: string;

  onClick(): void {
    if (this.to) {
      router.push(this.to);
    }
  }
}
</script>
