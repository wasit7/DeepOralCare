<script setup>
import { ref, onMounted } from "vue";
import triangleIcon from "../Icons/triangleIcon.vue";

const props = defineProps({
  // Props here.
  modelValue: {
    type: Boolean,
    default: true,
  },
  right: Boolean,
  bottom: Boolean,
});

// const overlay = ref(true);

// const toggleOverlay = () => {
//   overlay.value = !overlay.value;
// };
</script>

<template>
  <div
    :class="` shadow-lg ${
      modelValue
        ? bottom
          ? 'h-1/4 w-full'
          : 'w-1/3 md:w-1/4 h-full'
        : bottom
        ? 'h-0 w-full '
        : 'w-0  h-full'
    }   bg-white  fixed ${right ? 'right-0 h-full' : ''} ${
      bottom ? '    bottom-0 ' : ''
    } duration-500 z-30 `"
  >
    <div
      :class="`px-1 py-2 shadow absolute bg-white -z-10 ${
        bottom ? 'left-20 -top-10 w-16 h-10 ' : 'top-20'
      }   cursor-pointer ${right ? ' -left-6 rounded-l-md' : '-right-6 rounded-r-md'}`"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <div
        :class="` flex items-center justify-center w-2/3 h-2/3 ${
          modelValue
            ? right
              ? 'rotate-180'
              : bottom
              ? ' -rotate-90 '
              : ' '
            : right
            ? ''
            : bottom
            ? 'rotate-90'
            : 'rotate-180'
        }`"
      >
        <slot name="expandIcon"> <triangle-icon /> </slot>
      </div>
    </div>
    <div
      :class="`${
        modelValue ? ' ' : ' overflow-hidden'
      } bg-white  h-full  overflow-auto relative  flex flex-col`"
    >
      <slot name="content"> content Here ! </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
