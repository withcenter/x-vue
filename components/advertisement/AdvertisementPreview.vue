<template>
  <router-link :to="`/advertisement/edit/${post.idx}`">
    <div class="d-flex">
      <div class="overflow-hidden">
        <div>No. {{ post.idx }}</div>
        <div class="text-truncate">
          {{ post.title ? post.title : "No title .." }}
        </div>
        <div>
          <span class="badge badge-success" v-if="post.isAdvertisementActive">
            Active
          </span>
          <span class="badge badge-warning" v-if="!post.isAdvertisementActive">
            Inactive
          </span>
        </div>
        <div class="text-truncate">
          {{ post.content ? post.content : "No content .." }}
        </div>
      </div>
      <span class="flex-grow-1"></span>
      <div class="p-1" v-for="file of post.files" :key="file.idx">
        <img
          style="height: 90px; width: 90px"
          :src="file.url"
          :alt="file.name"
        />
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { PostModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["post"],
})
export default class AdvertisementPreview extends Vue {
  post!: PostModel;
}
</script>
