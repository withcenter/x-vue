<template>
  <router-link class="story d-flex align-items-center" :to="post.relativeUrl">
    <b-img class="col-3 p-0 h-100" :src="post.files[0].url"></b-img>
    <div class="overflow-hidden">
      <div class="ml-2 title font-weight-bold" :class="isTwoLine ? '' : 'text-truncate'">
        {{ post.title }}
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.story {
  height: 70px;
}

.title {
  max-height: 3em;
}
</style>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import ComponentService from "@/x-vue/services/component.service";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ThumbnailWithTextAtRight extends Vue {
  @Prop({
    type: PostModel,
    default: () => ComponentService.instance.temporaryPost(),
  })
  post!: PostModel;

  @Prop({ default: false })
  isTwoLine!: boolean;
}
</script>
