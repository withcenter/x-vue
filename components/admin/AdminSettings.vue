<template>
  <div>
    <h4>Admin Settings</h4>

    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Admin email addresses</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
        <small id="emailHelp" class="form-text text-muted">
          Input multip admin email addresses separating by comma(,).
        </small>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class AdminSettings extends Vue {
  form = {};
}
</script>
