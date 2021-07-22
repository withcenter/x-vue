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

- `x-vue` should be independent as much as possible from parent app.
  - But components in `x-vue` can use the following properties from root app.
    - So, root app must set this before using `x-vue` component.
      while `x-vue/services` are not using these properties.

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

- **ApiService must not depend on parent app.**
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

- `ApiService` must be initialized before `Vue` initialization.
  - Since when `Vue` initialize, `App.vue` will be mounted immediately before the `ApiService` initialization.
    - It will leads any `ApiService` call from `App.vue` will fail.
    - If you have `AppService` and if it depends on `ApiService`, then `ApiService` must be initialized first before `AppService` initialization. Or api call from `AppService` construction will be failed.
  - And, `ApiService` adds some filters like `t` for translation.

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

- `ComponentService.alert` is using `translate` function by default. So, if you are using it directly or from helpers, you don't have to manually call `translate` any more.

```ts
export default class UploadImage extends Vue {
  confirmDelete = translate("do_you_want_to_delete");
```

- You can deliver text object for translation.

```html
{{ { en: "Create Sample Posts, comments", ko: "샘플 글/코멘트/사진 생성" } | t }}
```



## User login and logout

- 사용자 register, login, logout, and profile update 등을 하면,
  `userChages` 콜백이 호출되는데, 이 곳에서 로그인/로그아웃 `store.commi('user', ...)` 와 같이 업데이트를 하면 된다.
  이렇게 하면 매번 사용자 정보가 변경될 때 마다 `store.commi('user', ...)` 를 호출 할 필요 없다.
  단, 회원 사진을 업로드하는 경우, `files` 테이블만 수정하기 때문에, 사용자 프로필을 읽고, `store.commi('user', ...)` 으로 업데이트를 해 주어야 한다.

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

# 관리자 페이지

- `x-vue` 컴포넌트에서 제공하는 관리자 페이지는 범용적으로 많이 쓰이는 것만 제공한다.
- 예를 들어, 소너브 카페에서 기본 게시판을 생성하는 것은 소너브에 한정된 기능이기 때문에, `x-vue` 에 넣으면 안된다.
  - 따라서, 소너브 카페에 한정된 기능은 별도의 메뉴(페이지)를 만들고, 그 곳에 관리자 기능을 따로 만들어야 한다.

- 기본 샘플(예제)글/코멘트를 만드는 것은 `x-vue` 에서 제공 가능하다.

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


## 캐시

- `latestPosts()` 함수는 `options.callback` 파라메타에 콜백 함수를 전달 하면,
  내부적으로 자동 캐시를 해서 보다 빠르게 내용을 화면에 표시 할 수 있다.

- 아래의 코드는 캐시를 하는 예제인데, await 을 하지 않아서, 세 개의 게시판으로 부터 최근글을 빠르게 한번 화면에 표시해 주고, promise 작업이 끝나면, 서버로 부터 가져온 데이터를 localStorage 에 저장하고, 화면에 한번 더 그려준다.

```ts
  mounted(): void {
    this.api
      .latestPosts({ categoryId: "travel", limit: 4 }, { callback: (posts) => (this.travel = posts) })
      .then((posts) => (this.travel = posts))
      .catch((e) => this.app.error(e));
    this.api
      .latestPosts({ categoryId: "discussion", limit: 5 }, { callback: (posts) => (this.discussion = posts) })
      .then((posts) => (this.discussion = posts))
      .catch((e) => this.app.error(e));
    this.api
      .latestPosts({ categoryId: "qna", limit: 5 }, { callback: (posts) => (this.qna = posts) })
      .then((posts) => (this.qna = posts))
      .catch((e) => this.app.error(e));
  }
```

- 아래의 코드는 캐시를 하지 않는 예제인데, 두개를 비교해 보면 속도 차이를 알 수 있다.

```ts
  async mounted(): Promise<void> {
    try {
      this.travel = await this.api.latestPosts({ categoryId: "travel", limit: 4 });
      this.discussion = await this.api.latestPosts({ categoryId: "discussion", limit: 5 });
      this.qna = await this.api.latestPosts({ categoryId: "qna", limit: 5 });
      this.loaded = true;
    } catch (e) {
      this.app.error(e);
    }
  }
```

# 디버깅

## Dev console 에서 Vue 앱에 접근하기 - `app.__vue__.$store.state;`


`app.__vue__` 와 같이 접근하면 된다.
`app.__vue__.$store.state;` 와 같이 하면 상태를 볼 수 있다.





## Dev console 에서 async 함수 호출하고 결과 확인하기

아래의 두 가지 방법으로 할 수 있다.
```js
app.__vue__.api.version().then(function(v) { console.log(v); });
console.log(await app.__vue__.api.version());
```


# 최근 글 가져오기, 캐시

- `latestPosts()` 함수는 내부적으로 캐시를 한다. 페이지별 게시판 글 목록이나, 최근 글 보여줄 때 사용하면 된다.
  - 단, 내용의 일부, 첫 코멘트, 첫 사진 등 전체를 다 가져오지 않으므로, 글 목록에서 내용을 바로 보여줄 때에는 적절하지 않다.
  - 검색 조건은 `postSearch()`와 동일 하다. 내부적으로 `postSearch()` 를 사용한다.
  - 아래와 같이 복잡한 쿼리를 할 수 있다.
    - 특히, `within` 뿐만아니라, `betweenFrom`, `betweenTo` 를 사용 할 수 있으며, 원하는데로 정렬 할 수 있다.

```ts
ApiService.instance
  .latestPosts(
    {
      ids: this.ids,
      subcategory: this.subcategory,
      limit: 4,
      files: "Y",
      within: 60 * 60 * 24 * 7, // 최근 7일 (1주) 동안의 최신 글에서 코멘트 많은 순으로 출력.
      order: "noOfComments DESC, createdAt DESC",
      by: "",
    },
    { callback: (posts) => (this.posts1 = posts) }
  )
  .then((posts) => (this.posts1 = posts));

ApiService.instance
  .latestPosts(
    {
      ids: this.ids,
      subcategory: this.subcategory,
      limit: 4,
      files: "Y",
      betweenFrom: 60 * 60 * 1, // 이 시간 시작 부터,
      betweenTo: 60 * 60 * 24 * 60, // 이 시간 사이, 최근 두 달 글
      order: "noOfComments DESC, createdAt DESC",
      by: "",
    },
    { callback: (posts) => (this.posts2 = posts) }
  )
  .then((posts) => (this.posts2 = posts));
```



# Test

- For test loign, access `/test` route.


# Info

- to see information of the app, access `/info`.

