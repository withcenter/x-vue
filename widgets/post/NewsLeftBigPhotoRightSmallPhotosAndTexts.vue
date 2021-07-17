<template>
  <section>
    <h1>@여기서 부터, 아래의 위젯을 그대로 따서 만든다. 그리고, 뉴스 탭으로 넣는다.</h1>
    <div class="row" v-if="posts.length">
      <div class="col-6">
        <h1>{{ posts[0].title }}</h1>
        <img class="w-100" :src="posts[0].files[0].url" />
      </div>
      <div class="col-6"></div>
    </div>
  </section>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @Prop() categoryId!: string;
  posts: PostModel[] = [];
  async mounted(): Promise<void> {
    try {
      this.posts = await ApiService.instance.latestPosts({ categoryId: this.categoryId, files: "Y", limit: 15 });
    } catch (e) {
      ComponentService.instance.error(e);
    }
  }
}
</script>
