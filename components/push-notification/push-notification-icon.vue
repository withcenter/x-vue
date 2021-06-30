<template>
  <div class="push-notification-icon">
    <b-form-checkbox
      v-model="data[postTopic]"
      name="check-button"
      switch
      @change="onChangeSubscribeOrUnsubscribeTopic"
    >
      {{ title | t }}
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import Service from "@/x-vue/services/x-vue.service";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({})
export default class PushNotificationIcon extends Vue {
  @Prop({ default: "defaultTopic" }) topic!: string;
  @Prop({ default: "" }) title!: string;

  // 'notifyPost_' is the prefix for post topic subscription
  get postTopic(): string {
    return "notifyPost_" + this.topic;
  }

  data: { [index: string]: boolean } = {
    [this.postTopic]: false,
  };

  async mounted(): Promise<void> {
    try {
      console.log("postTopic::", this.postTopic);
      const re = await ApiService.instance.isSubscribedToTopic(this.postTopic);
      console.log("PushNotificationIcon", re);
      this.data[this.postTopic] = re[this.postTopic] === "Y" ? true : false;
    } catch (e) {
      // XHelper.instance.error(error);
      this.$emit("error", e);
    }
  }

  async onChangeSubscribeOrUnsubscribeTopic(): Promise<void> {
    console.log(
      "onChangeSubscribeOrUnsubscribeTopic::",
      this.data[this.postTopic]
    );
    if (!ApiService.instance._user.loggedIn) {
      this.data[this.postTopic] = false;
      Service.instance.error("error_login_first");
      return;
    }
    try {
      await ApiService.instance.topicSubscription({
        topic: this.postTopic,
        subscribe: this.data[this.postTopic] ? "Y" : "N",
      });
    } catch (e) {
      Service.instance.error(e);
    }
  }
}
</script>
