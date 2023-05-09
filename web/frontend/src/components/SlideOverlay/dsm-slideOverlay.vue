<script setup>
import { ref, onMounted, computed, watch } from "vue";
import triangleIcon from "../Icons/triangleIcon.vue";

const props = defineProps({
  // Props here.
  modelValue: {
    type: Boolean,
    default: true,
  },
  left: {
    type: Boolean,
    default: true,
  },
  right: {
    type: Boolean,
    default: false,
  },
  bottom: {
    type: Boolean,
    default: false,
  },
});

const slideClass = computed(() => {
  let classDefault = "bg-white shadow-lg fixed duration-500 z-30";

  if (props.right) {
    classDefault = `${classDefault} right-0 w-full`;
  }

  if (props.bottom) {
    classDefault = `${classDefault} bottom-0`;

    if (props.modelValue) {
      classDefault = `${classDefault} h-2/4 w-full`
    } else {
      (classDefault = `${classDefault} h-0 w-full`)
    }
  }

  if (props.left) {
    classDefault = `${classDefault} bottom-0`;

    if (props.modelValue) {
      classDefault = `${classDefault} pt-4 w-5/6 h-full md:w-2/5 lg:w-2/6 xl:w-1/5 `;
    } else {
      classDefault = `${classDefault} pt-4 w-0 h-full md:w-0 `;
    }
  }

  // //
  // props.modelValue & props.bottom
  //   ? classDefault = `${classDefault} h-2/4 w-full`
  //   : classDefault = `${classDefault} w-3/4 md:w-1/4 h-full`

  // !props.modelValue & props.bottom
  //       ? (classDefault = `${classDefault} h-0 w-full`)
  //       : (classDefault = `${classDefault} w-0 h-full`)

  // console.log(classDefault);
  return classDefault
});

console.log(slideClass.value);

watch(() => props.modelValue, () => {
  // let classDefault = "bg-white shadow-lg fixed duration-500 z-30";

  // // if (modelValue & bottom) {
  // //   classDefault = `${classDefault} h-1/4 w-full`;
  // // } else {
  // //   classDefault = `${classDefault} w-3/4 md:w-1/4 h-full`;
  // // }

  // if (props.right) {
  //   classDefault = `${classDefault} right-0 w-full`;
  // }

  // if (props.bottom) {
  //   classDefault = `${classDefault} bottom-0`;
  // }

  // //
  // props.modelValue & props.bottom
  //   ? classDefault = `${classDefault} h-1/4 w-full`
  //   : classDefault = `${classDefault} w-3/4 md:w-1/4 h-full`

  // !props.modelValue & props.bottom
  //       ? (classDefault = `${classDefault} h-0 w-full`)
  //       : (classDefault = `${classDefault} w-0 h-full`)

  // console.log(classDefault);
   console.log(slideClass.value);
});
</script>

<!-- 
  modelValue = panel-toggle (ON of OFF)

  default:
    bg-white shadow-lg fixed duration-500 z-30


  if On & Bottom = 'h-1/4 w-full' else = 'w-3/4 md:w-1/4 h-full'
  if Off & Bottom = 'h-0 w-full' else 'w-0 h-full'
  if Right ? 'right-0 h-full' : ''
  if Bottom ? 'bottom-0'
 -->

<template>
  <div
    :class="slideClass"
  >
    <div
      :class="`px-1 py-2 shadow absolute bg-white -z-10 ${
        bottom ? 'left-20 -top-10 w-16 h-10 ' : 'top-20'
      }   cursor-pointer ${
        right ? ' -left-6 rounded-l-md' : '-right-6 rounded-r-md'
      }`"
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
      <p>{{ slideClass }}</p>
      <slot name="content"> content Here ! </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
