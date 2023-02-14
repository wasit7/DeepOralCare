<script setup>
import { ref } from "vue";
import dsmSlideOverlay from "../SlideOverlay/dsm-slideOverlay.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  data: {},
});
</script>

<template>
  <dsm-slide-overlay :v-model="modelValue" class="pt-16" right>
    <template v-slot:content>
      <div class="py-6 px-10">
        <p class="text-[22px]">รายละเอียด</p>
      </div>
    </template>
  </dsm-slide-overlay>
</template>

<style scoped lang="scss"></style>
