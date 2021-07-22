<template>
  <div class="push-notification-icon">
    <b-form-checkbox v-model="data[postTopic]" name="check-button" switch @change="onChangeSubscribeOrUnsubscribeTopic">
      <span>{{ title | t }}</span>
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { ApiService } from "@/x-vue/services/api.service";
import Service from "@/x-vue/services/component.service";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({})
export default class PushNotificationIcon extends Vue {
  @Prop({ default: "defaultTopic" }) topic!: string;
  @Prop({ default: "" }) rawTopic!: string;
  @Prop({ default: "" }) title!: string;

  @Prop({ default: false }) subscribedByDefault!: boolean;

  // 'notifyPost_' is the prefix for post topic subscription
  get postTopic(): string {
    if (this.rawTopic.length) return this.rawTopic;
    return "notifyPost_" + this.topic;
  }

  data: { [index: string]: boolean } = {
    [this.postTopic]: false,
  };

  async mounted(): Promise<void> {
    try {
      const re = await ApiService.instance.isSubscribedToTopic(this.postTopic, this.subscribedByDefault);
      this.data[this.postTopic] = re[this.postTopic] === "Y" ? true : false;
    } catch (e) {
      Service.instance.error(e);
    }
  }

  async onChangeSubscribeOrUnsubscribeTopic(): Promise<void> {
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
