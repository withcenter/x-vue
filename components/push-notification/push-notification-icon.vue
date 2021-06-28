<template>
  <div class="push-notification-icon">
    <b-form-checkbox
      v-model="data[topic]"
      name="check-button"
      switch
      @change="onChangeSubscribeOrUnsubscribeTopic"
    >
      qna
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { XFunctions } from "@/x-vue-helper/functions";
import { ApiService } from "@/x-vue/services/api.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: ["topic"],
  components: {},
})
export default class PushNotificationIcon extends Vue {
  //
  topic!: string;
  data: { [index: string]: boolean } = {};

  async onChangeSubscribeOrUnsubscribeTopic(): Promise<void> {
    if (ApiService.instance.notLoggedIn) {
      XFunctions.instance.alert("Login required", "Please login first");
      this.data[this.topic] = false;
      return;
    }
    try {
      ApiService.instance.topicSubscription({
        topic: this.topic,
        subscribe: this.data[this.topic] ? "on" : "off",
      });
    } catch (error) {
      XFunctions.instance.error(error);
    }
  }
}
</script>
