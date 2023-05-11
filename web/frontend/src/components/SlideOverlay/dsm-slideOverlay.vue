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
    default: false,
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
  let classDefault = "bg-white shadow-lg fixed duration-500";

  if (props.right) {
    classDefault = `${classDefault} hidden md:block z-20 right-0 md:h-full`;

    if (props.modelValue) {
      classDefault = `${classDefault} md:h-full md:w-2/5 lg:w-2/6 xl:w-1/5`
    } else {
      classDefault = `${classDefault} pt-0 md:h-full md:w-0 lg:w-0 xl:w-0`;
    }
  }

  if (props.bottom) {
    classDefault = `${classDefault} z-20 border-2 bottom-0`;

    if (props.modelValue) {
      classDefault = `${classDefault} h-3/5 w-full`
    } else {
      (classDefault = `${classDefault} pt-0 h-0 w-full`)
    }
  }

  if (props.left) {
    classDefault = `${classDefault} z-30 bottom-0 pt-16`;

    if (props.modelValue) {
      classDefault = `${classDefault} pt-4 w-5/6 h-full md:w-2/5 lg:w-2/6 xl:w-1/5 `;
    } else {
      classDefault = `${classDefault} pt-4 w-0 h-full md:w-0 `;
    }
  }
  return classDefault
});

const toggleSlideClass = computed(() => {
  // let classOption = "cursor-pointer bg-white shadow-lg fixed duration-500 z-30";
  let classOption = "";

  if (props.bottom) {
    classOption = `${classOption} -top-10 w-full rounded-t-lg border-t flex justify-center`;
  } else {
    classOption = `${classOption} top-20`;
  }

  if (props.right) {
    classOption = `${classOption} pl-2 -left-6 rounded-l-md`;
  } else if (!props.right & !props.bottom) {
    classOption = `${classOption} -right-6 rounded-r-md`;
  }

  if (props.left) {
    classOption = `${classOption} pl-2`; 
  }

  return classOption;
});

watch(() => props.modelValue, () => console.log(slideClass.value, toggleSlideClass.value));
</script>


<template>
  <div :class="slideClass">
    <div
      id="toggleSlide"
      class="absolute cursor-pointer py-2 shadow bg-white -z-10"
      :class="toggleSlideClass"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <div
        class="flex items-center justify-center w-2/3 h-2/3"
        :class="`  ${
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
      class="bg-white duration-300 h-full  overflow-auto relative  flex flex-col"
      :class="{
        // 'overflow-hidden': !modelValue
      }"
    >
      <slot name="content"> content Here ! </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
