<script setup>
import { onMounted, ref, watchEffect } from "vue";

import searchIcon from "../Icons/searchIcon.vue";

defineProps({
  // Props here.
  modelValue: {
    type: String,
    default: "",
  },
  appendItem: Boolean,
  placeholder: String,
  multipleChip: Boolean,
  chipValue: Array,
});
</script>

<template>
  <div>
    <!-- <label for="price" class="block text-sm font-medium text-gray-700"
      >Price</label
    > -->
    <div class="relative flex flex-wrap mt-1 rounded-full">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <span class="text-gray-500 sm:text-sm"><search-icon /> </span>
      </div>

      <div
        :class="`flex flex-wrap gap-2 py-1 border border-[#F2AD4E] w-full h-10 rounded-full shadow pl-12  ${
          appendItem ? 'pr-32 xl:pr-52' : 'pr-12'
        }  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`"
      >
        <div
          class="flex items-center gap-2 p-2 bg-[#163168] text-white rounded-full"
          v-for="(chip, index) in chipValue"
          :key="chip.label"
        >
          <span>{{ chip }}</span>
          <span
            class="cursor-pointer bg-[#F2AD4E] rounded-full w-4 h-4 flex items-center justify-center"
            @click="chipValue.splice(index, 1)"
            >x</span
          >
        </div>
        <input
          type="text"
          name="text"
          id="text"
          :class="` w-full h-full  `"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
      <div
        v-if="appendItem"
        class="absolute inset-y-0 right-0 flex items-center"
      >
        <slot name="append-item"> </slot>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
