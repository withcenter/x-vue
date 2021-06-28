<template>
  <div class="push-notification-icon">
    <b-form-checkbox
      v-model="data[topic]"
      name="check-button"
      switch
      @change="onChangeSubscribeOrUnsubscribeTopic"
    >
      {{ title | t }}
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import { XHelper } from "@/x-vue-helper/x-helper";
import { ApiService } from "@/x-vue/services/api.service";
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
  // props: ["topic", "title"],
})
export default class PushNotificationIcon extends Vue {
  @Prop({ default: "defaultTopic" }) topic!: string;
  @Prop({ default: "" }) title!: string;

  data: { [index: string]: boolean } = {
    [this.topic]: false,
  };

  async mounted(): Promise<void> {
    console.log("topic::", this.topic);
    // await Vue.nextTick();

    // console.log("topic::", this.topic);
    try {
      console.log("topic::", this.topic);
      const re = await ApiService.instance.isSubscribedToTopic(this.topic);
      console.log("PushNotificationIcon", re);
      this.data[this.topic] = re[this.topic] === "Y" ? true : false;
    } catch (error) {
      XHelper.instance.error(error);
    }
  }

  async onChangeSubscribeOrUnsubscribeTopic(): Promise<void> {
    console.log("onChangeSubscribeOrUnsubscribeTopic::", this.data[this.topic]);
    if (!ApiService.instance._user.loggedIn) {
      XHelper.instance.alert("Login required", "Please login first");
      this.data[this.topic] = false;
      return;
    }
    try {
      await ApiService.instance.topicSubscription({
        topic: this.topic,
        subscribe: this.data[this.topic] ? "Y" : "N",
      });
    } catch (error) {
      XHelper.instance.error(error);
    }
  }
}
</script>
