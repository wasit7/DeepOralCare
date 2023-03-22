<script setup>
import { onMounted, ref, watchEffect } from "vue";

import SearchIcon from "../Icons/searchIcon.vue";

const props = defineProps({
    label: {
        type: String,
        default: "LABEL_NAME"
    },
    placeholder: {
        type: String,
        default: "placeholder"
    },
    modelValue: {
        type: String,
        default: "",
    },
    icon: {
        required: false
    },
    borderColor: {
        type: String,
        default: "#FFB11D"
    },
    focusBorderColor: {
        type: String,
        default: "#F28606"
    },
    
});
</script>

<template>
    <div class="form-input-group">
        <p class="text-base"> {{ props.label }} </p>
        <label for="simple-search" class="sr-only">{{ props.placeholder }}</label>
        <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg 
                    aria-hidden="true" 
                    class="w-5 h-5 text-gray-300 dark:text-gray-400" 
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <input 
                required
                type="text" 
                id="simple-search" 
                class="
                    block w-full pl-10 p-1.5 rounded-md
                    bg-gray-50 
                    text-gray-700 text-sm
                    border border-solid border-[#FFB11D]
                    focus:outline-none focus:border-[#F28606]
                    "
                :placeholder="props.placeholder" 
            />
        </div>
    </div>
</template>
