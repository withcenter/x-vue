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

  - `this.$store.state.user` can be used but must be read only.
  - `this.$store.commit('user', userModel)` to update user model data. To login, logout, refresh.
  - One thing to remember is that the Vuex store must not have logic inside.

- The parent must import and enable `vue-router` module, so `x-vue` can use to navigate inside.

- The parent app must install `bootstrap version 4.x`, `bootstrap vue version 2.x`. And make them available for `x-vue`.

  - So, `x-vue` can use the full features of `bootstrap` and `bootstrap vue`.

- If the parent is using `x-vue` components and wants to have same UI of `alert`, `confirm`, `error`, `toast`, then the parent must set them as callback functions with `ComponentService.init({})`. So, the `x-vue` can use the callback to display UI dialogs.
  **This is optional**.

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

## Api Service Initialization

- ApiService must not depend on parent app.
  - It must not use any of parent's
    - store
    - route
    - UI things
    - logic
    - And another other from parent's app.
  
- But `x-vue components` in `x-vue/components` may use some of the parent's app functionality.
  - So, The parent app must set the following;
    - `this.$store.state.user` as user model properties.
    - `this.$router`. So the `x-vue` model can navigates between pages.
    - `bootstrap 4.x` and `bootstrap 2.x` to work.

- `ApiService` must be initialized before `Vue` initialization, Since `AppService` adds
  some filters like `t` for translation.

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

## t, translation filter

- The filter `t` for translation is registered by the initialization of `ApiService`.
  - You can use like `{{ 'abc' | t }}` where `abc` is the text code.

- You can also use `translate` function from `functions.ts`.

```ts
export default class UploadImage extends Vue {
  confirmDelete = translate("do_you_want_to_delete");
```
## User login and logout

- Below is the login form component from `x-vue`.
  - It may login and emit an event of success or failure to parent app.
  - But what it does is only to emit parent of form submission. So, parent app can handle the rest.
  - It's a choice of development design.
    - The importance is that, whatever the design might be, `x-vue` must not depends on parent's app.

```vue
<template>
  <div>
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


# Components and Widgets

- If a component and its children component are the core part of a page(screen) and it goes into `x-vue/components` folder.
  - For instance, a `post-list` comopnent is the core part of post list page. so, it should go into `x-vue/components`.
- If a component is not a part of specific page(screen), and it can be used in any places, then it goes into `x-vue/widgets`.
  - For instance, `latest-posts` component can be displayed in sidebar area and it is not belonging to a single page(screen), so it should go into `x-vue/widgets`.


- 각 컴포넌트의 설명은 주석으로 해 놓는다.



# Forum


## Forum Interface

- The reason why there is an interface for forum related pages is to set a protocol.
  - So, forum related pages can communicate each other in a unified way.
  - For instance, the post list page can include its child component without passing props like below.
```ts
<PostListLoading></PostListLoading>
```
  - And the parent component and child component can communicate with each other.
  - For child component, it can simply access parent's member properties like below.
```ts
<div class="..." v-if="$parent.forum.loading">
```


## Forum customization

- It is important to let developers customize their own design while they can use main logic.
  - For instance, `x-vue-default` project has a `views/Forum.vue` that has all the child components to make the forum functionalities.
    - Developer can simply change(or re-make) one of the components if he want to change the design.
    - Developer can change its design within the single `Forum.vue` component.


