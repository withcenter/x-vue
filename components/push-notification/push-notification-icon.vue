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
import { XHelper } from "@/x-vue-helper/x-helper";
import { ApiService } from "@/x-vue/services/api.service";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
  props: ["topic"],
  components: {},
})
export default class PushNotificationIcon extends Vue {
  //
  @Prop({ default: "defaultTopic" }) topic!: string;
  @Prop({ default: "" }) title!: string;

  data: { [index: string]: boolean } = {};

  async mounted(): Promise<void> {
    if (!this.topic) this.topic = "defaultTopic";
    try {
      //   const re = await ApiService.instance.isSubscribedToTopic(this.topic);
    } catch (error) {
      XHelper.instance.error(error);
    }
  }

  async onChangeSubscribeOrUnsubscribeTopic(): Promise<void> {
    if (!ApiService.instance._user.loggedIn) {
      XHelper.instance.alert("Login required", "Please login first");
      this.data[this.topic] = false;
      return;
    }
    try {
      await ApiService.instance.topicSubscription({
        topic: this.topic,
        subscribe: this.data[this.topic] ? "on" : "off",
      });
    } catch (error) {
      XHelper.instance.error(error);
    }
  }
}
</script>
