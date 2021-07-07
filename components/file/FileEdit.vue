<template>
  <div class="h-100 file-edit">
    <div class="trash" @click="$emit('delete', file)">
      <trash-svg></trash-svg>
    </div>
    <img class="h-100" :src="file.url" :alt="file.name" />
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
/**
 * (공용 위젯)
 *
 * 사진(파일)을 보여주고, 삭제 버튼을 보여준다.
 * 삭제 버튼을 클릭하면, 이벤트를 상위로 전달한다.
 *
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { FileModel } from "@/x-vue/interfaces/interfaces";
import TrashSvg from "@/x-vue/svg/TrashSvg.vue";

@Component({
  components: { TrashSvg },
})
export default class FileDisplay extends Vue {
  @Prop() file!: FileModel;
}
</script>
