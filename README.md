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

# Style Guide

- `x-vue` should be independent as much as possible from parent app. But there are certain properties that `x-vue` can use from the page.

  - `this._router` to navigate from `x-vue` components.
  - `this.$store.state.user` can be used but must be read only.
  - `this.$store.commit('user', userModel)` to update user model data. To login, logout, refresh.

- The parent app must install `bootstrap version 4.x`, `bootstrap vue version 2.x`. And make them available for `x-vue`.

  - So, `x-vue` can use the full features of `bootstrap` and `bootstrap vue`.

- If the parent is using `x-vue` components and wants to have same UI of `alert`, `confirm`, `error`, `toast`, then the parent must set them as callback functions with `ComponentService.init({})`. So, the `x-vue` can use the callback to display UI dialogs.

# How to use

## Display boxes - alert, toast, confirm, error

- `x-vue` is using `x-vue.service.ts` to use the dialog boxes like `alert`, `toast`, `confirm`, `error`, `confirmToast`, and more.

  - `x-vue.service` handles with basic Javascript alert or confirm dialog when the parent app didn't set up the dialog callbackes.

- The parent app can set the callbacks for these dialogs, so the `x-vue` components can use the same UI of its parent app.

  - Below is an example of how to set up callbacks. Simply connect the methods that the parent app is using.

```ts
ComponentService.instance.init({
  alert: (t: string, m: string) => x.alert(t, m),
  confirmToast: (options: ConfirmToast) => x.confirmToast(options),
  toast: (options: Toast) => x.toast(options),
  confirm: (t: string, m: string) => x.confirm(t, m),
});
```

- And in `x-vue` component, it can use `x-vue.service.ts` to use its parent's callback methods to use the parent's dialogs.

```ts
s = ComponentService.instance;
// ...
onDialogCall() {
  await this.s.error("This is an error");
  console.log("Showing error box has done!");
  this.s.confirmToast({
    title: "confirm toast title",
    message: "confirm toast content",
    yesCallback: () => console.log("yes"),
    noCallback: () => console.log("no"),
  });
  const re = await this.s.confirm("hi", "how are you?");
  console.log("re; ", re);
}
```

## Initialization

- The parent app must set

  - `this.$store.state.user` as user model properties.
  - `this.$router`. So the `x-vue` model can navigates between pages.
  - `bootstrap 4.x` and `bootstrap 2.x` to work.

- `ApiService` must be initialized before `Vue` initialization, Since `AppService` adds
  some filters.

- You can set

  - `serverUrl` to point where is the `Matrix` restful api endpoint.
  - `userChanges` callback event handler that will be called on every user change(login/logout/profile update, etc)
  - `apiKey` to access the backend if needed.

- Below is an example of `main.ts`. It shows how to initialize the `ApiService` and how to update `store` to use the status of user login, logout.

```ts
import store from "./store";
import { ApiService } from "./x-vue/services/api.service";
import { UserModel } from "./x-vue/services/interfaces";

/// ApiService must be initialized before Vue initialization.
ApiService.instance.init({
  serverUrl: "https://main.philov.com/index.php",
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
