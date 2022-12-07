<script setup>
import searchIcon from "../Icons/searchIcon.vue";

defineProps({
  // Props here.
  modelValue: {
    type: String,
    default: "",
  },
  appendItem: Boolean,
  placeholder: String,
  chips: Boolean,
});
</script>

<template>
  <div>
    <!-- <label for="price" class="block text-sm font-medium text-gray-700"
      >Price</label
    > -->
    <div class="relative mt-1 rounded-full">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <span class="text-gray-500 sm:text-sm"><search-icon /> </span>
      </div>
      <input
        type="text"
        name="text"
        id="text"
        :class="` border border-[#163168] block w-full h-10 rounded-full shadow pl-12 ${
          appendItem ? 'pr-32 xl:pr-52' : 'pr-12'
        }  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div
        v-if="appendItem"
        class="absolute inset-y-0 right-0 flex items-center"
      >
        <slot name="append-item"> </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
