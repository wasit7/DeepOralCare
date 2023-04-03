<script setup>
import { onMounted, ref, watchEffect } from "vue";

// import SearchIcon from "../Icons/searchIcon.vue";
const emit = defineEmits(['onSearch', 'onSelectResult'])
const props = defineProps({
  label: {
    type: String,
    default: "LABEL_NAME",
  },
  placeholder: {
    type: String,
    default: "placeholder",
  },
  modelValue: {
    type: Object,
    default: "",
  },
  icon: {
    required: false,
  },
  borderColor: {
    type: String,
    default: "#FFB11D",
  },
  focusBorderColor: {
    type: String,
    default: "#F28606",
  },
  placeholder: String,
  chipValue: {
    type: Array,
    default: [],
  },
  result: Array,
  appendItem: Boolean,
  isLoading: {
    type: Boolean,
    default: false,
  },
  dropdowns: {
    type: Array || null,
    default: [],
  },
});

const inputFocus = ref(false);

const onSearchDisease = async () => {
  console.log(`onSearchDiseaseWork`);
  const temp = await storeMain.getSearch(searchDisease);
  resultDisease.value = await storeMain.search_result;
  console.log(temp);
  console.log(resultDisease);
};

const onSearch = (value) => {
  inputFocus.value = true;
  // console.log(value);
  emit('onSearch', value)
}

const onSelectResult = (result) => {
  console.log(result);
  emit('onSelectResult', result);
  inputFocus.value = false;
}

const onBlur = () => {
  setTimeout(() => {
    inputFocus.value = false;
  }, 100);
}
</script>

<template>
  <!-- <div class="relative"> -->
  <div class="form-input-group relative">
    <p class="text-base">{{ props.label }}</p>
    <label for="simple-search" class="sr-only">{{ props.placeholder }}</label>
    <div class="relative w-full z-1">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-300 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        @input="onSearch($event.target.value)"
        :value="modelValue.name"
        required
        @blur="onBlur"
        type="text"
        id="simple-search"
        class="z-1 block w-full pl-10 p-1.5 rounded-md bg-gray-50 text-gray-700 text-sm border border-[#FFB11D] focus:outline-none focus:border-[#F28606] focus:ring-2 placeholder:text-gray-300"
        :placeholder="props.placeholder"
      />
    </div>
    <div
      id="dropdown"
      :class="`${
        inputFocus ? 'block ' : 'hidden'
      } absolute z-10 bg-white divide-y divide-gray-100 rounded-b-lg shadow w-full max-h-80 overflow-scroll dark:bg-gray-700`"
    >
      <ul
        v-if="isLoading && !!dropdowns"
        class="py-2 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200"
        aria-labelledby="dropdown-button"
      >
      <li class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
        loading ...
      </li>
      </ul>
      <ul
        v-else
        v-for="(item, index) in dropdowns" :key="item.id"
        class="py-2 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200"
        aria-labelledby="dropdown-button"
      >
        <li @click="onSelectResult(item)">
          <button
            type="button"
            class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {{ item.name }}
          </button>
        </li>

      </ul>
    </div>
  </div>

  <!-- </div> -->
</template>

<style scoped></style>
