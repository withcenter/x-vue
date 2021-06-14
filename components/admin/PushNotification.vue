<template>
  <section data-cy="push-notification-create-page">
    <h4>Push Notification</h4>
    <form>
      <div class="form-group">
        <label for="status">{{ "sending option" | t }}</label>
        <select
          class="custom-select"
          id="notify"
          name="notify"
          v-model="options.notify"
        >
          <option value="all">{{ "all" | t }}</option>
          <option value="topic">{{ "topic" | t }}</option>
          <option value="tokens">{{ "token" | t }}</option>
          <option value="email">{{ "email" | t }}</option>
        </select>
      </div>
      <div class="form-group" v-if="options.notify == 'topic'">
        <label for="idx">{{ "topic" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'topic' | t"
          name="topic"
          id="topic"
          v-model="options.topic"
        />
      </div>
      <div class="form-group" v-if="options.notify == 'tokens'">
        <label for="idx">{{ "token" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'token' | t"
          name="tokens"
          id="tokens"
          v-model="options.tokens"
        />
      </div>
      <div class="form-group" v-if="options.notify == 'email'">
        <label for="idx">{{ "email" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'email' | t"
          name="email"
          id="email"
          v-model="options.email"
        />
      </div>
      <div class="form-group">
        <label for="idx">{{ "landing post idx" | t }}</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            :placeholder="'post idx' | t"
            name="idx"
            id="idx"
            v-model="options.idx"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary px-5"
              type="button"
              @click="loadPostIdx()"
            >
              {{ "load post idx" | t }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="idx">{{ "title" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'title' | t"
          name="title"
          id="title"
          v-model="options.title"
        />
      </div>
      <div class="form-group">
        <label for="idx">{{ "content" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'content' | t"
          name="body"
          id="body"
          v-model="options.body"
        />
      </div>
      <div class="form-group">
        <label for="idx">{{ "click url" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'click url' | t"
          name="click_action"
          id="click_action"
          v-model="options.click_action"
        />
      </div>
      <div class="form-group">
        <label for="idx">{{ "Icon Url" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'Icon Url' | t"
          name="imageUrl"
          id="imageUrl"
          v-model="options.imageUrl"
        />
        <small class="form-text text-muted">
          If the post has an image, that image will be used as Icon. or Default
          image in 'config.php' will be used.
        </small>
      </div>
      <div class="form-group">
        <label for="idx">{{ "sound" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'sound' | t"
          name="sound"
          id="sound"
          v-model="options.sound"
        />
        <div class="text-muted">
          Make sure to include the file extension. It will not work on IOS if it
          dont have file extension.
        </div>
      </div>
      <div class="form-group">
        <label for="idx">{{ "channel id" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'channel id' | t"
          name="channel"
          id="channel"
          v-model="options.channel"
        />
      </div>

      <div class="d-flex justify-content-between mt-2 mb-3">
        <div>
          <button
            type="button"
            class="btn btn-primary"
            @click="sendPushNotification()"
          >
            <span v-if="!loading">{{ "send notification" | t }}</span>
            <span v-if="loading">{{ "loading" | t }}</span>
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { AppService } from "@/service/app.service";
import { DEFAULT_TOPIC } from "@/x-vue/services/defines";
import { RequestData, ResponseData } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminPushNotification extends Vue {
  app = AppService.instance;

  options = {
    idx: "",
    notify: "all",
    topic: "",
    tokens: "",
    email: "",
    title: "",
    body: "",
    click_action: "",
    imageUrl: "",
    sound: "telephoneringwav.wav",
    channel: "PUSH_NOTIFICATION",
  };
  loading = false;

  mounted(): void {
    if (this.$route.params.postIdx) {
      this.options.idx = this.$route.params.postIdx;
    }
    this.loadPostIdx();
  }

  async loadPostIdx(): Promise<void> {
    console.log(this.options.idx);
    if (this.options.idx === "") return;
    let options: RequestData = {
      idx: this.options.idx,
    };
    try {
      const post = await this.app.api.postGet(options);
      this.options.title = post.title;
      this.options.body = post.content;
      this.options.click_action = post.url;
      if (post.files.length > 0) {
        this.options.imageUrl = post.files[0].url;
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.app.error(e);
    }
  }
  async sendPushNotification(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    const data: RequestData = {
      route: "notification.sendMessageToTopic",
      title: this.options.title,
      body: this.options.body,
      click_action: this.options.click_action,
      imageUrl: this.options.imageUrl,
      sound: this.options.sound,
      channel: this.options.channel,
    };
    if (this.options.idx) {
      data["data"] = {
        idx: this.options.idx,
        type: "post",
      };
    }

    try {
      let res: ResponseData = {};
      if (this.options.notify === "all") {
        data["topic"] = DEFAULT_TOPIC;
        res = await this.app.api.sendMessageToTopic(data);
      } else if (this.options.notify === "topic") {
        data["topic"] = this.options.topic;
        res = await this.app.api.sendMessageToTopic(data);
      } else if (this.options.notify === "tokens") {
        data["tokens"] = this.options.tokens;
        res = await this.app.api.sendMessageToTokens(data);
      } else if (this.options.notify === "email") {
        data["tokens"] = this.options.tokens;
        res = await this.app.api.sendMessageToTokens(data);
      }
      this.loading = false;
      console.log(res);
      if (this.options.notify === "tokens") {
        if (res.success.length > 0) {
          alert("Success Sending push notification to tokens.");
        } else if (res.error.length > 0) {
          alert("Error Sending push notification to tokens. " + res.error[0]);
        } else {
          alert("Api Error on sending to tokens.");
        }
      } else {
        alert("Success Sending push notification to topic.");
      }
    } catch (e) {
      this.loading = false;
      this.app.error(e);
    }
  }
}
</script>
