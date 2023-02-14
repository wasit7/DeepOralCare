<script setup>
import { ref, watch } from "vue";

import circleLoading from "../loading/circle-loading.vue";
import dsmSlideOverlay from "../SlideOverlay/dsm-slideOverlay.vue";
import findMatchLabel from "../../utils/matchLabelName.js";
findMatchLabel();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  resultData: {
    type: Object || null,
    default: null,
  },
});

const isLoading = ref(false);
const updateList = ref([]);
const selectUpdate = ref(0);

const resolveUpdateList = async (data) => {
  await data.forEach((item, index) => {
    updateList.value.push({
      index: index,
      label: item.hist_desc + ` (${item.last_upd_date})`,
    });
  });
};

watch(
  () => props.resultData,
  async (newValue, oldValue) => {
    // Note: `newValue` will be equal to `oldValue` here
    // *unless* state.someObject has been replaced
    updateList.value = [];
    selectUpdate.value = 0;
    isLoading.value = true;
    await resolveUpdateList(newValue.update_profile);
    console.log("P1 prop:", newValue);
    setTimeout(() => {
      isLoading.value = false;
    }, 240);
  },
  { deep: true }
);

// onUpdate(() => {
//   console.log("U1");
// });
</script>

<template>
  <dsm-slide-overlay :v-model="modelValue" class="pt-16 overflow-auto" right>
    <template v-slot:content>
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
        <div class="flex-grow flex flex-col pb-6">
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

            <div class="mt-3">
              <p class="w-full border text-center font-semibold">
                Update profile ({{ resultData.update_profile.length }})
              </p>
              <select class="w-full border" v-model="selectUpdate">
                <!-- <option disabled value="">Please select one</option> -->
                <option v-for="item in updateList" :value="item.index">
                  {{ item.label }}
                </option>
              </select>
              <div
                v-for="(value, key) in resultData.update_profile[selectUpdate]"
                class="flex justify-between border-collapse"
              >
                <p class="w-5/12 p-1 border">{{ findMatchLabel(key) }}:</p>
                <p class="w-7/12 p-1 border break-all">{{ value }}</p>
              </div>
            </div>
            <!-- {{ resultData }} -->
          </div>

          <span v-else class="m-auto opacity-70">
            - เลือกหัวข้อในรายการที่พบ เพื่อดูรายละเอียด -
          </span>
        </div>
      </div>
    </template>
  </dsm-slide-overlay>
</template>

<style scoped lang="scss"></style>
