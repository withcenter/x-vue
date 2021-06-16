<template>
  <section data-cy="push-notification-create-page">
    <h4>{{ "push notification" | t }}</h4>
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
          <option value="emails">{{ "emails" | t }}</option>
        </select>
      </div>
      <div class="form-group" v-if="options.notify == 'topic'">
        <label for="topic">{{ "topic" | t }}</label>
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
        <label for="tokens">{{ "tokens" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'token' | t"
          name="tokens"
          id="tokens"
          v-model="options.tokens"
        />
      </div>
      <div class="form-group" v-if="options.notify == 'emails'">
        <label for="emails">{{ "emails" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'emails' | t"
          name="emails"
          id="emails"
          v-model="options.emails"
        />
        <div class="text-muted">
          Input user email. Send to many emails. Separated them by comma.
        </div>
      </div>
      <div class="form-group" v-if="options.notify == 'emails'">
        <label for="users">{{ "users" | t }}</label>
        <input
          type="text"
          class="form-control"
          :placeholder="'users' | t"
          name="users"
          id="users"
          v-model="options.users"
        />
        <div class="text-muted">
          Input user idx. Send to many Users. Separated them by comma.
        </div>
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
        <label for="title">{{ "title" | t }}</label>
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
        <label for="click_action">{{ "click url" | t }}</label>
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
        <label for="imageUrl">{{ "Icon Url" | t }}</label>
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
        <label for="sound">{{ "sound" | t }}</label>
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
        <label for="channel">{{ "channel id" | t }}</label>
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
import { ApiService } from "@/x-vue/services/api.service";
import { DEFAULT_TOPIC } from "@/x-vue/services/defines";
import { RequestData, ResponseData } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminPushNotification extends Vue {
  options = {
    idx: "",
    notify: "all",
    topic: "",
    tokens: "",
    emails: "",
    users: "",
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
      const post = await ApiService.instance.postGet(options);
      this.options.title = post.title;
      this.options.body = post.content;
      this.options.click_action = post.url;
      if (post.files.length > 0) {
        this.options.imageUrl = post.files[0].url;
      }
      this.loading = false;
    } catch (e) {
      this.loading = false;
      ApiService.instance.error(e);
    }
  }

  async sendPushNotification(): Promise<void> {
    if (this.loading) return;
    this.loading = true;
    const data: RequestData = {
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

      /**
       * Base on sending option it will request from the server
       * All = send notification to default topic
       * Topic = send notification to the givent topic
       * Tokens = send notification to given tokens
       * UserIDX/Emails = send notification to existing idx/email with their registed tokens
       */
      if (this.options.notify === "all") {
        data["topic"] = DEFAULT_TOPIC;
        res = await ApiService.instance.sendMessageToTopic(data);
      } else if (this.options.notify === "topic") {
        data["topic"] = this.options.topic;
        res = await ApiService.instance.sendMessageToTopic(data);
      } else if (this.options.notify === "tokens") {
        data["tokens"] = this.options.tokens;
        res = await ApiService.instance.sendMessageToTokens(data);
      } else if (this.options.notify === "emails") {
        data["emails"] = this.options.emails;
        data["users"] = this.options.users;
        res = await ApiService.instance.sendMessageToUsers(data);
      }

      this.loading = false;

      if (this.options.notify === "tokens") {
        const s = res.success.length;
        const f = res.error.length;
        ApiService.instance.alert(
          "Send Push Message to tokens",
          `${s} Success, ${f} Fail.`
        );
      } else {
        ApiService.instance.alert(
          "Send Push Message to topic",
          "Success Sending push notification to topic."
        );
      }
    } catch (e) {
      this.loading = false;
      ApiService.instance.error(e);
    }
  }
}
</script>
