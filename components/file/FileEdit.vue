<template>
  <div class="file-edit">
    <div class="trash" @click="$emit('delete', file)">
      <trash-svg></trash-svg>
    </div>
    <img :src="file.url" :alt="file.name" />
  </div>
</template>
<style lang="scss" scoped>
.file-edit {
  position: relative;
  .trash {
    position: absolute;
    top: 0;
    right: 0;
    width: 28px;
  }
  img {
    width: 100%;
  }
}
</style>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import TrashSvg from "@/x-vue/components/svg/TrashSvg.vue";

@Component({
  components: { TrashSvg },
})
export default class FileDisplay extends Vue {
  @Prop() file!: FileModel;
}
</script>
