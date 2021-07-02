<template>
  <div>
    <button type="submit" class="btn btn-success" v-if="!$parent.submitted">
      {{ "submit" | t }}
    </button>
    <b-spinner
      class="mx-2"
      type="grow"
      variant="success"
      v-if="$parent.submitted"
    ></b-spinner>
  </div>
</template>