# x-vue

# Reference

- For an exmaple of `x-vue, see [x-admin](https://github.com/withcenter/x-admin) app that does administration on matrix.


# Install

```sh
% npm i axios
% npm i dayjs
% npm i firebase
% npm i js-cookie
% npm i -D @types/js-cookie
```

# How to use


## Initialization

- Set the backend host into `ApiService.instance.init()`. It only supports https scheme.

- Below are `main.ts`. It shows how to initialize the `ApiService` and how to update `store` to use the status of user login, logout.
```ts
import store from "./store";
import { ApiService } from "./x-vue/services/api.service";
import { UserModel } from "./x-vue/services/interfaces";
ApiService.instance.init({
  host: "main.philov.com",
  userChanges: (user: UserModel) => {
    store.state.user = user;
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

## User login and logout


- Below are the example of `store/index.ts` which handles user state.

```ts
import { ApiService } from "@/x-vue/services/api.service";
import { UserModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

class App {
  static alert(e: string): void {
    alert(e);
  }
}

export default new Vuex.Store({
  state: {
    user: new UserModel(),
  },
  mutations: {
    login: async (state, form) => {
      try {
        state.user = await ApiService.instance.login(form);
        console.log("state.user", state.user);
      } catch (e) {
        App.alert(e);
      }
    },
  },
  actions: {},
  modules: {},
});
```


# Style Guide

## ApiService

- ApiService must not depend on parent app.
  - It must not use any of parent's
    - store
    - route
    - UI things
    - logic
    - And another other from parent's app.

## X-Vue components and widgets communication

- See how the `x-vue` and `parent app` communicate. The logic is actually on `store`.

```vue
<template>
  <div>
    <h1>Login</h1>
    <login @submit="onSubmit"></login>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Login from "@/x-vue/components/user/Login.vue";

@Component({
  components: {
    Login,
  },
})
export default class LoginView extends Vue {
  onSubmit(event: Event, form: Request): void {
    console.log("event; ", event);
    console.log("form; ", form);
    this.$store.commit("login", form);
  }
}
</script>
```


- Below is the `store/index.ts`. The logic is in the `store action`. So, the `x-vue` and `parent app` are completely isolated.

```ts
import { ApiService } from "@/x-vue/services/api.service";
import { UserModel } from "@/x-vue/services/interfaces";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

class App {
  static alert(e: string): void {
    alert(e);
  }
}

export default new Vuex.Store({
  state: {
    user: new UserModel(),
  },
  mutations: {
    login: async (state, form) => {
      try {
        state.user = await ApiService.instance.login(form);
        console.log("state.user", state.user);
      } catch (e) {
        App.alert(e);
      }
    },
  },
  actions: {},
  modules: {},
});
```


- Below is the login form component from `x-vue`.
  - It may login and emit an event of success or failure to parent app.
  - But what it does is only to emit parent of form submission. So, parent app can handle the rest.
  - It's a choice of development design.
    - The importance is that, whatever the design might be, `x-vue` must not depends on parent's app.

```vue
<template>
  <div data-cy="login-form">
    <h1>User Login</h1>
    <form @submit.prevent="$emit('submit', $event, form)">
      <div class="form-group">
        Email
        <input v-model="form.email" type="text" name="email" />
      </div>
      <div class="form-group">
        Password
        <input v-model="form.password" type="password" name="password" />
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Login extends Vue {
  form = {};
}
</script>
```