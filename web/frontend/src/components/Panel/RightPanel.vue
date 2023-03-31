<script setup>
import { storeToRefs } from "pinia";
import { ref, watch, computed } from "vue";

import { useMainStore } from "../../stores/mainStore";

import circleLoading from "../loading/circle-loading.vue";
import dsmSlideOverlay from "../SlideOverlay/dsm-slideOverlay.vue";
import findMatchLabel from "../../utils/matchLabelName.js";

const mainStore = useMainStore();
const props = defineProps({
  resultData: {
    type: Object || null,
    default: null,
  },
});

const panelState = ref(true);
const isLoading = ref(false);
const updateList = ref([]);
const selectUpdate = ref(0);

const store = storeToRefs(mainStore);
const labelOverviews = computed(() => mainStore.overview_data.labels);
// const relationshipOverview = mainStore.relationship_overview;

const resolveUpdateList = async (data) => {
  await data.forEach((item, index) => {
    updateList.value.push({
      index: index,
      label: item.hist_desc + ` (${item.last_upd_date})`,
    });
  });
};

watch(store, ()=> {
  console.log('M1:',store.value)
  // console.log('M1.3:', mainStore.label_overview);
  // console.log('M1.4:', mainStore.overview_data);
}, { deep: true })

watch(
  () => props.resultData,
  async (newValue, oldValue) => {
    updateList.value = [];
    selectUpdate.value = 0;
    if (newValue) {
      isLoading.value = true;
      await resolveUpdateList(newValue.update_profile);
      setTimeout(() => {
        isLoading.value = false;
      }, 240);
    }
  },
  { deep: true }
);
</script>

<template>
  <dsm-slide-overlay
    v-model="panelState"
    @update:model-value="$emit('update:modelValue', panelState)"
    class="pt-16"
    right
  >
    <template v-slot:content>
      <div class="w-full h-full overflow-auto">
        <div class="pt-4 px-10 pb-3 sticky top-0 bg-white shadow-sm">
          <p class="text-[22px]">รายละเอียด</p>
        </div>
        <div
          v-if="isLoading"
          class="min-h-full py-6 px-10 flex flex-col gap-3 flex-grow"
        >
          <circle-loading column />
        </div>
        <div v-else class="min-h-full py-6 px-10 flex flex-col gap-3 flex-grow">
          <div class="flex flex-col pb-6">
            <div v-if="resultData" class="flex flex-col">
              <p class="font-semibold">ชื่อ: {{ resultData.name }}</p>
              <p class="font-semibold">ประเภท: {{ resultData.kind }}</p>
              <div class="mt-2">
                <p class="w-full border text-center font-semibold">Attribute</p>
                <div
                  v-for="(value, key) in resultData.attribute"
                  class="flex justify-between border-collapse"
                >
                  <p class="w-5/12 p-1 border">{{ findMatchLabel(key) }}:</p>
                  <p class="w-7/12 p-1 border break-all">{{ value }}</p>
                </div>
              </div>

              <!-- {{ resultData }} -->
              <!-- <div class="flex-col">
                <p class="text-lg">Overview</p>
                <span class="text-grey-300 text-sm">Node Labels</span>
                <span class="text-grey-300 text-sm">Relationship Types</span>
              </div> -->
            </div>

            <span v-else class="text-sm my-10 opacity-70">
              - เลือกหัวข้อในรายการที่พบ เพื่อดูรายละเอียด -
            </span>
          </div>
          <div class="flex-col mb-auto">
            <p class="text-lg">Overview</p>
            <p class="text-grey-300 text-sm">Node Labels</p>
            <div
              class="nodes-group inline-block my-0.5"
              v-for="(label, index) in labelOverviews"
              :key="index"
            >
              <div
                v-if="label.count > 0 || label.name == 'ALL'"
                :style="{ backgroundColor: label.color}"
                :class="`inline-block text-xs text-white font-medium mr-2 py-1 px-3 rounded-full`"
                >{{ label.name }} ({{ label.count }}) </div
              >
            </div>

            <p class="text-grey-300 text-sm">Relationship Types</p>
            <span
              class="bg-gray-500 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
              >Dark</span
            >
          </div>
        </div>
      </div>
    </template>
  </dsm-slide-overlay>
</template>

<style scoped lang="scss"></style>
