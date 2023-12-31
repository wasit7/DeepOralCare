<script setup>
import { ref, reactive } from "vue";
import searchIcon from "../Icons/searchIcon.vue";
import loading from "../loading/circle-loading.vue";
import crossIcon from "../Icons/crossIcon.vue";

const props = defineProps({
  // Props here.
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: String,
  chipValue: {
    type: Array,
    default: [],
  },
  result: Array,
  appendItem: Boolean,
  loadingState: {
    type: Boolean,
    default: false,
  },
  resultList: {
    type: Array,
    default: [],
  },
});

// state here.
const onFocus = ref(false);

const focusInput = () => {
  const input = document.getElementById("input-chip");
  input.focus();
  onFocus.value = true;
};

const removeDuplicate = (id) => {
  let check = Object.values(props.chipValue).find((item) => item.id == id);
  console.log("c:", check);
  return check === undefined ? true : false;
};
</script>

<template>
  <div class="relative">
    <div
      :class="`relative flex  mt-1 ${
        chipValue.length > 0 && onFocus
          ? ' rounded-3xl px-4 pr-4 flex-wrap'
          : 'rounded-full pl-12 pr-4'
      } gap-2 py-1 border border-[#F2AD4E] w-full h-full shadow bg-white overflow-hidden  `"
      @click="focusInput()"
    >
      <div
        :class="`${
          chipValue.length > 0 && onFocus ? ' hidden' : ''
        } pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`"
      >
        <span class="text-gray-500 sm:text-sm"><search-icon /> </span>
      </div>

      <div class="flex gap-1" v-if="onFocus">
        <div
          class="flex items-center gap-1 px-2 py-1 bg-[#163168] text-white rounded-full"
          v-for="(chip, index) in chipValue"
          :key="chip.id"
        >
          <span>{{ chip.name }} ({{ chip.id }})</span>
          <span
            class="cursor-pointer bg-[#F2AD4E] rounded-full w-4 h-4 flex items-center justify-center z-20"
            @click="chipValue.splice(index, 1)"
            ><cross-icon
          /></span>
        </div>
      </div>
      <div class="flex gap-1" v-else>
        <div
          class="flex items-center gap-1 px-2 py-1 bg-[#163168] text-white rounded-full"
          v-for="(chip, index) in chipValue.slice(0, 4)"
          :key="chip.id"
        >
          <span
            class="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] hover:w-auto duration-500"
            >{{ chip.name }} ({{ chip.id }})</span
          >
          <span
            class="cursor-pointer bg-[#F2AD4E] rounded-full w-4 h-4 flex items-center justify-center z-20"
            @click="chipValue.splice(index, 1)"
            ><cross-icon
          /></span>
        </div>
        <div class="flex items-center" v-if="chipValue.length > 4">
          <span class="w-max h-max"
            >& {{ chipValue.slice(4).length }} more</span
          >
        </div>
      </div>

      <input
        type="text"
        name="text"
        id="input-chip"
        class="w-full focus:outline-none"
        :placeholder="placeholder"
        :value="modelValue"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="onFocus = true"
        @blur="onFocus = false"
      />
      <div
        v-if="appendItem"
        class="absolute inset-y-0 right-0 flex items-center"
      >
        <slot name="append-item"> </slot>
      </div>
    </div>
    <div
      :class="` ${
        modelValue != '' ? '' : ' hidden '
      }  absolute mt-1 w-full max-h-60 overflow-auto bg-white border rounded-md z-10`"
    >
      <ul v-if="resultList.length > 0">
        <li v-for="(item, index) in props.resultList" :key="index">
          <div
            class="py-2 px-3 hover:bg-gray-100 cursor-pointer"
            v-if="removeDuplicate(item.id)"
            @click="
              chipValue.push(item);
              $emit('update:modelValue', '');
            "
          >
            {{ item.name }} ({{ item.id }})
          </div>
        </li>
      </ul>
      <div v-else class="py-2">
        <loading v-if="loadingState" />
        <p v-else class="text-left px-3 py-2">No result found</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
