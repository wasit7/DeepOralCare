<script setup>
import { onMounted, ref, watchEffect } from "vue";

import searchIcon from "../Icons/searchIcon.vue";

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
});
</script>

<template>
    <div class="flex flex-col justify-start gap-1 w-full">
        <p class="text-base"> {{ props.label }} </p>
        <div id="input-group" class="flex felx-row justify-start gap-y-2">
            <!-- <span class="text-gray-500 sm:text-sm"> -->
                <!-- icon
                <search-icon colors="#194456" /> -->
            <!-- </span> -->
            <input
                type="text"
                name="disease"
                id="text"
                class="
                    w-full h-full 
                    border-solid border-2 border-[#3b8f85]
                    p-1 rounded-md 
                    placeholder:text-sm placeholder:text-gray-300
                    focus:outline-none focus:border-[#194456]"
                :placeholder="props.placeholder"
                :value="props.modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </div>
    </div>
</template>
