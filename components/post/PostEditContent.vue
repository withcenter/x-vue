<template>
  <div>
    {{ "content" | t }}
    <div class="form-group">
      <textarea
        class="w-100 form-control"
        v-model="$parent.forum.post.content"
        type="text"
        name="content"
      />
    </div>
  </div>
</template>
