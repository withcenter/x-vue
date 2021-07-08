<template>
  <section>
    <h4>Post list</h4>
    <div class="overflow-auto">
      <b-table striped hover :items="forum.posts" :fields="fields">
        <template #cell(user)="user">
          <div class="d-flex">
            <!-- <div>
              <div class="mr-3" :style="'height:50px;width:50px'">
                <b-img thumbnail fluid rounded="circle" :src="user.item.user.photoUrl"></b-img>
              </div>
            </div> -->

            <b-avatar class="mr-1" :src="user.item.user.photoUrl"></b-avatar>
            <div>
              <div>{{ user.item.user.name }}</div>
              <!-- <div>{{ user.item.user }}</div> -->
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script lang="ts">
import { ForumInterface } from "@/x-vue/interfaces/forum.interface";
import { ApiService } from "@/x-vue/services/api.service";
import ComponentService from "@/x-vue/services/component.service";
import Vue from "vue";
import Component from "vue-class-component";
@Component({ components: {} })
export default class AdminPostList extends Vue {
  forum: ForumInterface = new ForumInterface();

  fields = ["user", "idx", "title", "category_Id"];

  mounted(): void {
    this.forum.limit = 5;
    this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    // console.log(this.forum.searchOptions);
    if (this.forum.canLoad) return;
    this.forum.loading = true;

    console.log(this.forum.searchOptions);
    try {
      this.forum.posts = await ApiService.instance.postSearch(this.forum.searchOptions);
      console.log(this.forum.posts);
    } catch (error) {
      ComponentService.instance.error(error);
    }
    this.forum.endLoad();
  }
}
</script>
