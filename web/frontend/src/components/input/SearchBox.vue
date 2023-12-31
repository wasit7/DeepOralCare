<script setup>
import { onMounted, reactive, ref, watchEffect } from "vue";
import { NODE_LABEL_COLOR } from "../../utils";

// import SearchIcon from "../Icons/searchIcon.vue";
const emit = defineEmits(["onSearch", "onSelectResult", "onBlur", "onKeyBackspace"]);
const props = defineProps({
  label: {
    type: String,
    default: "LABEL_NAME",
  },
  placeholder: {
    type: String,
    default: "placeholder",
  },
  textInvalid: {
    type: String,
    default: "field errors"
  },
  inputInvalid: {
    type: Boolean,
    default: false
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
const isTyping = ref(false);
const isTouched = ref(false);
const isBlurTimeout = ref(null);

const onSearch = (value) => {
  inputFocus.value = true;
  isTouched.value = false;
  // console.log(value);
  emit("onSearch", value);
};

const onSelectResult = (result) => {
  // console.log(result);
  emit("onSelectResult", result);
  isTouched.value = false;
  inputFocus.value = false;
};

const onBlur = () => {
  clearTimeout(isBlurTimeout.value);
  isBlurTimeout.value =  setTimeout(() => {
    inputFocus.value = false;
    isTouched.value = true;
    emit("onBlur", inputFocus.value);
  }, 300);
};

const onKeyup = () => setTimeout(() => (isTyping.value = false), 800);

const onKeydown = (event) => {
  isTyping.value = true;
  const keyName = event.key.toLowerCase();
  // console.log(`[on-keydown]: ${keyName}`);

  if (keyName === 'backspace') {
    // console.log(`[keyname]: ${keyName} has pressed to set-id to null ${props.modelValue.id}`);
    props.modelValue.id = null;
  }
  
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
        @blur="onBlur"
        @keydown="onKeydown"
        @keyup="onKeyup"
        :value="modelValue.name"
        required
        type="text"
        id="simple-search"
        class="z-1 block w-full pl-10 p-1.5 rounded-md bg-gray-50 text-gray-700 text-sm border border-primary-light focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary placeholder:text-gray-300"
        :placeholder="props.placeholder"
      />
    </div>
    <p 
      v-if="inputInvalid && isTouched" 
      class="text-xs text-red-500 pb-1 px-1">
        {{ textInvalid }}
    </p>
    <div
      id="dropdown"
      :class="`${
        inputFocus ? 'block ' : 'hidden'
      } absolute z-10 bg-white divide-y divide-gray-100 rounded-b-lg shadow w-full max-h-80 overflow-scroll dark:bg-gray-700`"
    >
      <ul
        v-if="(isLoading && !!dropdowns) || isTyping"
        class="py-2 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200"
        aria-labelledby="dropdown-button"
      >
        <li
          class="inline-flex w-full px-8 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          seaching ...
        </li>
      </ul>
      <ul
        v-else
        v-for="(item, index) in dropdowns"
        :key="item.id"
        class="py-0 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200"
        aria-labelledby="dropdown-button"
      >
        <li @click="onSelectResult(item)">
          <button
            type="button"
            class="inline-flex content-center items-baseline gap-x-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span
              :style="{ backgroundColor: NODE_LABEL_COLOR[item.label] }"
              :class="`flex w-3 h-3 rounded-full`"
            ></span>
            {{ item.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>

  <!-- </div> -->
</template>

<style scoped></style>
