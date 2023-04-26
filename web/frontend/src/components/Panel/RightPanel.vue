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
const relationshipOverviews = computed(
  () => mainStore.overview_data.relationships
);

const concateSourceUrl = ({id, source, source_url, other}) => {
  const links = []
  let link = `${source_url}${id}`
  switch (source) {
    case "MONDO_grouped":
      const ids = id.split("_");
      ids.map( id => links.push(`${source_url}${id.padStart(7, 0)}`))
      break;
  
    default:
      id = id.padStart(7, 0)
      link = `${source_url}${id}`
      links.push(link)
      break;
  }
  return links
}

// const resolveUpdateList = async (data) => {
//   await data.forEach((item, index) => {
//     updateList.value.push({
//       index: index,
//       label: item.hist_desc + ` (${item.last_upd_date})`,
//     });
//   });
// };

watch(
  store,
  () => {
    console.log("M1:", store.value);
    // console.log('M1.3:', mainStore.label_overview);
    // console.log('M1.4:', mainStore.overview_data);
  },
  { deep: true }
);

watch(
  () => props.resultData,
  async (newValue, oldValue) => {
    // updateList.value = [];
    // selectUpdate.value = 0;
    if (newValue) {
      isLoading.value = true;
      // await resolveUpdateList(newValue.update_profile);
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
        <div class="pt-8 px-4 pb-3 sticky top-0 bg-white shadow-sm">
          <p class="text-xl">Description</p>
        </div>
        <div
          v-if="isLoading"
          class="min-h-full py-6 px-4 flex flex-col gap-3 flex-grow"
        >
          <circle-loading column />
        </div>
        <div v-else class="py-3 px-5 flex flex-col gap-3">
          <div class="flex flex-col pb-6">
            <div v-if="resultData" class="flex flex-col">
              <div class="relative overflow-x-hidden">
                <table
                  class="w-full text-ellipsis text-sm text-left text-gray-500 dark:text-gray-400"
                >
                  <tbody
                    class="text-xs text-gray-900 uppercase dark:text-gray-400"
                  >
                    <tr>
                      <th scope="col" class="truncate -px-1 py-2">ID : </th>
                      <td scope="col" class="hover:overflow-x-visible px-1 py-2">{{ resultData.id }}</td>
                    </tr>
                    <tr>
                      <th scope="col" class="truncate -px-1 py-2">Name : </th>
                      <td scope="col" class="truncate px-1 py-2">{{ resultData.name }}</td>
                    </tr>
                    <tr>
                      <th scope="col" class="truncate -px-1 py-2">Label : </th>
                      <td scope="col" class="truncate px-1 py-2">{{ resultData.label }}</td>
                    </tr>
                    <tr>
                      <th scope="col" class="truncate -px-1 py-2">Source : </th>
                      <td scope="col" class="truncate px-1 py-2">{{ resultData.attribute?.source }}</td>
                    </tr>
                    <tr>
                      <th scope="col" class="truncate -px-1 py-2 align-text-top">Detail : </th>
                      <td scope="col" class="truncate px-1 py-2">
                        <a v-for="link in concateSourceUrl({...resultData.attribute})" :key="link"
                          class="lowercase text-blue-500 hover:text-blue-700 active:text-blue-400 block" 
                          :href="link"
                          target="_blank">
                          {{ link }}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <span v-else class="text-sm my-10 opacity-70">
              - single-click on node for more detail -
            </span>
          </div>
          <div class="flex flex-col gap-2 mb-auto">
            <p class="text-lg">Overview</p>
            <div class="node-group">
              <p class="text-grey-300 text-sm">Node Labels</p>
              <div
                class="inline-block my-0.5"
                v-for="(label, index) in labelOverviews"
                :key="index"
              >
                <div
                  v-if="label.count > 0 || label.name == 'ALL'"
                  :style="{ backgroundColor: label.color }"
                  :class="`inline-block text-xs text-white font-medium mr-2 py-1 px-3 rounded-full`"
                >
                  {{ label.name }}
                </div>
              </div>
            </div>

            <div class="relationship-group">
              <p class="text-grey-300 text-sm">Relationship Types</p>
              <div
                class="inline-block my-0.5"
                v-for="(label, index) in relationshipOverviews.names"
                :key="index"
              >
                <div
                  v-if="index !== 0"
                  :style="{ backgroundColor: relationshipOverviews.color }"
                  :class="`inline-block text-xs text-white font-medium mr-2 py-1 px-3 rounded-sm`"
                >
                  {{ label }}
                </div>
                <div
                  v-if="index === 0"
                  :style="{ backgroundColor: relationshipOverviews.color }"
                  :class="`inline-block text-xs text-white font-medium mr-2 py-1 px-3 rounded-sm`"
                >
                  {{ label }} ({{ relationshipOverviews.count }})
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dsm-slide-overlay>
</template>

<style scoped lang="scss"></style>
