<template>
  <section>
    <b-progress>
      <b-progress-bar
        class="w-100"
        :value="$store.state.user.levelPercentage"
        :label="$store.state.user.levelPercentage + '%'"
        :variant="
          $store.state.user.levelPercentage > 90
            ? 'danger'
            : $store.state.user.levelPercentage > 70
            ? 'warning'
            : 'secondary'
        "
      ></b-progress-bar>
    </b-progress>
  </section>
</template>
