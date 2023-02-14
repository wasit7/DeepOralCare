<script setup>
import { ref, onMounted, computed, watchEffect, watch } from "vue";

import navigationBar from "../components/Navigation/navigation-bar.vue";
import { useRoute, useRouter } from "vue-router";
import dsmSlideOverlay from "../components/SlideOverlay/dsm-slideOverlay.vue";
import searchInput from "../components/input/search-input.vue";
import { useMainStore } from "../stores/mainStore";
import sigmaGraph from "../components/graph/sigma-relation.vue";
import inputMultiplechip from "../components/input/input-multiplechip.vue";
import { trimpEllipsis } from "../resources/format";
import RightPanel from "../components/Panel/RightPanel.vue";
import circleLoading from "../components/loading/circle-loading.vue";

const route = useRoute();
const router = useRouter();
const storeMain = useMainStore();

const searchQuery = ref("");
const searchEntity = ref("");
const valueChip = ref([]);
const panelLeft = ref(true);
const panelRight = ref(true);
const panelBottom = ref(true);
const searchTimeout = ref(null);
const itemsKey = ref([]);
const pageLoading = ref(false);
const selectResultID = ref(null);
const selectResultData = ref(null);

const entityFilter = computed(() => {
  return storeMain.entity_result?.filter((item) => {
    return item.name.toLowerCase().includes(searchEntity.value.toLowerCase());
  });
});

const entityRelation = computed(() => {
  return storeMain.relation_result;
});

const exploreRelation = computed(() => {
  return storeMain.explore_result;
});

const entityDetail = computed(() => {
  return storeMain.entity_detail;
});

onMounted(() => {
  console.log("mounted");
  const params = JSON.parse(sessionStorage.getItem("item_search"));
  console.log("params: " + params);
  if (params) {
    // searchQuery.value = params;
    valueChip.value = params;
    const id_list = params.map((i) => i.id);

    storeMain.getRelation(id_list);
  }
  // const queryString = route.query.key_word;
  // console.log(queryString);
  // if (queryString) {
  //   storeMain.getRelation(queryString.split(","));
  // }
});

const getDetail = async (id) => {
  selectResultID.value = id;
  selectResultData.value = await storeMain.getEntityDetail(id);
  console.log("Select:", selectResultData.value);
};

const getPredict = (queryString) => {
  storeMain.getSearch(queryString);
};

watchEffect(() => {
  if (searchQuery.value) {
    resetSelectResult();
    clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
      getPredict(searchQuery.value);
    }, 500);
  }
});

const resetSelectResult = () => {
  // Reset user select detail state
  selectResultData.value = null;
  selectResultID.value = null;
};

const onSearch = async () => {
  pageLoading.value = true;

  // Remove focus from input after use search
  // TODO: Refactor move it in to input-multiplechip component
  document.getElementById("input-chip").blur();

  if (searchQuery.value === "") {
    sessionStorage.setItem("item_search", JSON.stringify(valueChip.value));
    await storeMain.getRelation(valueChip.value.map((i) => i.id));
    router.push({
      name: "Search",
      params: {
        key_word: valueChip.value.map((i) => i.name).join(","),
      },
    });
  } else {
    const isExist = await storeMain.search_result.find(
      (i) => i.name === searchQuery.value
    );
    addChip(isExist);
  }
  pageLoading.value = false;
};

const addChip = (item) => {
  if (item) {
    const isExist = valueChip.value.find((i) => i.id === item.id);
    if (!isExist) {
      valueChip.value.push(item);
      searchQuery.value = "";
    }
  }
};

const removeChip = () => {
  if (!searchQuery.value && valueChip.value.length) {
    valueChip.value.pop();
  }
};

const onclickNode = async (id) => {
  storeMain.getEntityDetail(id);
  selectResultID.value = id;
  selectResultData.value = await storeMain.getEntityDetail(id);
};

const onrightClickNode = async (id) => {
  pageLoading.value = true;
  await storeMain.getExplore(id);
  setTimeout(() => {
    pageLoading.value = false;
  }, 240);
};
</script>

<template>
  <navigation-bar class="fixed w-full" search-able>
    <template v-slot:search>
      <input-multiplechip
        v-model="searchQuery"
        :chipValue="valueChip"
        :resultList="storeMain.search_result"
        :loading-state="storeMain.loading"
        @keyup.enter="onSearch"
        @keyup.backspace="removeChip"
      />
    </template>
  </navigation-bar>
  <!-- TODO: Components relation Graph here -->
  <div class="w-full h-screen relative bg-slate-50">
    <div
      v-if="pageLoading"
      class="w-full h-screen absolute bg-slate-700/70 z-40"
    >
      <circle-loading column />
    </div>
    <dsm-slide-overlay
      :class="`${
        panelLeft && panelRight
          ? ' w-2/4 left-1/4'
          : panelLeft
          ? ' left-1/4 w-full'
          : panelRight
          ? ' w-full'
          : 'left-0'
      }  `"
      v-model="panelBottom"
      bottom
    >
      <template v-slot:content>
        <div class="py-6 px-10">
          <div class="pt-4 px-10 pb-3 sticky top-0 bg-white shadow-sm">
            <p class="text-[22px]">
              รายละเอียดความสัมพันธ์ ({{ storeMain.sumRelation_result?.length }}
              ความสัมพันธ์)
            </p>
          </div>
          <div
            class="flex border-b w-full py-3"
            v-for="(item, index) in storeMain.sumRelation_result"
            :key="item"
          >
            <div class="text-center px-5">
              {{ index + 1 }}
            </div>
            <p>
              {{ item }}
            </p>
          </div>
        </div>
      </template>
    </dsm-slide-overlay>

    <dsm-slide-overlay v-model="panelLeft" class="pt-16">
      <template v-slot:content>
        <div
          class="flex flex-col gap-3 px-10 pt-6 sticky top-0 bg-white w-full"
        >
          <search-input v-model="searchEntity" :placeholder="'ค้นหารายการ'" />
          <p class="text-[22px]">รายการที่พบ</p>
        </div>
        <div class="flex flex-col">
          <ul
            class="min-h-[75px] border-b px-10 py-2 hover:bg-gray-100"
            :class="{ 'bg-gray-300': selectResultID === item.id }"
            v-for="item in entityFilter"
            :key="item.id"
          >
            <li @click="getDetail(item.id)">
              <p>{{ item.name }}</p>
              <p>{{ item.kind }}</p>
              <!-- <p v-for="key in Object.keys(item.attribute)" :key="key">
                {{ key }}
                {{
                  typeof item.attribute[key] === "object"
                    ? trimpEllipsis(item.attribute[key].join(", "), 20)
                    : item.attribute[key]
                }}
              </p> -->
            </li>
          </ul>
        </div>
      </template>
    </dsm-slide-overlay>

    <!-- Right panel -->
    <RightPanel v-model="panelRight" :result-data="selectResultData" />

    <sigma-graph
      :graph-data="entityRelation"
      :explore-data="exploreRelation"
      @click-node="onclickNode"
      @double-click-node="onrightClickNode"
    />
    <div
      :class="`absolute duration-500 bg-white z-20 ${
        panelRight && panelBottom
          ? ' right-1/4 bottom-1/4'
          : panelRight
          ? 'right-1/4 bottom-4'
          : panelBottom
          ? ' bottom-1/4 right-4'
          : ' right-4 bottom-4'
      }`"
    >
      <span class="flex gap-2 items-center px-3 py-2"
        ><div class="rounded-full w-5 h-5 bg-[#5879A3]" />
        <p>Person</p></span
      >
      <span class="flex gap-2 items-center px-3 py-2"
        ><div class="rounded-full w-5 h-5 bg-[#E49244]" />
        <p>Organization</p></span
      >
      <span class="flex gap-2 items-center px-3 py-2"
        ><div class="rounded-full w-5 h-5 bg-[#A77C9F]" />
        <p>Evidence</p></span
      >
      <span class="flex gap-2 items-center px-3 py-2"
        ><div class="rounded-full w-5 h-5 bg-[#6A9E58]" />
        <p>Transaction</p></span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
