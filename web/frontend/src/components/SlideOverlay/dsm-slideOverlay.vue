<script setup>
import { ref, onMounted } from "vue";
import triangleIcon from "../Icons/triangleIcon.vue";

defineProps({
  // Props here.
  right: Boolean,
});

const overlay = ref(true);

const toggleOverlay = () => {
  overlay.value = !overlay.value;
};
</script>

<template>
  <div
    :class="`shadow ${
      overlay ? ' w-2/3 xl:w-1/4' : 'w-0 '
    } h-full bg-white  absolute ${right ? 'right-0' : ''} duration-500 z-30 `"
  >
    <div
      :class="` px-2 py-5 shadow absolute  top-24  cursor-pointer ${
        right ? ' -left-7' : '-right-7'
      }`"
      @click="toggleOverlay"
    >
      <div
        :class="`${
          overlay ? (right ? 'rotate-180' : '') : right ? '' : 'rotate-180'
        }`"
      >
        <slot name="expandIcon"> <triangle-icon /> </slot>
      </div>
    </div>
    <div
      :class="`${
        overlay ? ' ' : ' overflow-hidden'
      } bg-white  max-h-full  overflow-auto relative`"
    >
      <slot name="content"> content Here ! </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
