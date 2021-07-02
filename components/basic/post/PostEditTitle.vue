<template>
  <div>
    {{ "title" | t }}
    <div class="form-group">
      <input
        class="w-100 form-control"
        v-model="$parent.post.title"
        type="text"
        name="title"
      />
    </div>
  </div>
</template>