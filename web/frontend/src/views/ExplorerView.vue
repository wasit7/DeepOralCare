<script setup>
import { ref, reactive, onMounted, computed, watchEffect, watch } from "vue";
import Logo from "../assets/imgs/CA-AppLogo.png";
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

// Components
import SearchBox from "../components/input/SearchBox.vue";
import DagreGraph from "../components/graph/DagreGraph.vue"

// Icons
import searchIcon from "../components/Icons/searchIcon.vue";

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

const searchDisease = ref({ id: "", name: "" });
const searchExposure = ref({ id: "", name: "" });
const resultDisease = ref(null);
const resultExposure = ref(null);
const searchLoading = reactive({
  disease: false,
  exposure: false,
});
const searchInputTimeout = reactive({
  disease: null,
  exposure: null,
});

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
  storeMain.loading = true;

  // Remove focus from input after use search
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

  storeMain.loading = false;
  pageLoading.value = false;
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

const onExplore = async () => {
  const { id: diseaseId } = searchDisease.value;
  const { id: exposureId } = searchExposure.value;
  const ids = [diseaseId, exposureId].filter( (elem) => !!elem);
  console.log(`searching relationship between ${diseaseId} and ${exposureId} (${ids.length})`);
  await storeMain.getRelation(ids);
};

const onSelection = (entity, entitySelected) => {
  entity.id = entitySelected.id;
  entity.name = entitySelected.name;
  console.log(entity);
};

const onSearchEntity = async (searchObj) => {
  await storeMain.getSearch(searchObj.name);
  const results = storeMain.search_result;
  return results;
};

watch(searchDisease.value, (newValue) => {
  console.log("watch disease");
  clearTimeout(searchInputTimeout.disease);
  searchLoading.disease = true;
  searchInputTimeout.disease = setTimeout(async () => {
    console.log("search");
    resultDisease.value = await onSearchEntity(searchDisease.value);
    searchLoading.disease = false;
  }, 700);
});

watch(searchExposure.value, (newValue) => {
  console.log("watch exposure", searchExposure);
  clearTimeout(searchInputTimeout.exposure);
  searchLoading.exposure = true;
  searchInputTimeout.exposure = setTimeout(async () => {
    console.log("search");
    resultExposure.value = await onSearchEntity(searchExposure.value);
    searchLoading.exposure = false;
  }, 700);
});
</script>

<template>
  <!-- Navigation -->
  <navigation-bar
    class="fixed w-full"
    app-name="CA search"
    :search-able="false"
    :app-logo="Logo"
  >
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

  <!-- Graph Explorer -->
  <div class="w-full h-screen relative bg-slate-50">
    <div
      v-if="pageLoading"
      class="w-full h-screen absolute bg-slate-700/70 z-40"
    >
      <circle-loading column />
    </div>

    <!-- Panel: Left -->
    <dsm-slide-overlay v-model="panelLeft" class="pt-16 w-full h-full">
      <template class="h-3/5" v-slot:content>
        <div class="flex flex-col gap-3 px-5 pt-6 sticky top-0 bg-white w-full">
          <SearchBox
            label="Disease"
            placeholder="touge cancer"
            v-model="searchDisease"
            :is-loading="searchLoading.disease"
            @on-search="searchDisease.name = $event"
            @on-select-result="onSelection(searchDisease, $event)"
            :dropdowns="resultDisease"
          />
          <SearchBox
            label="Exposure"
            placeholder="tobacco tar"
            v-model="searchExposure"
            :is-loading="searchLoading.exposure"
            @on-search="searchExposure.name = $event"
            @on-select-result="onSelection(searchExposure, $event)"
            :dropdowns="resultExposure"
          />

          <button
            type="button"
            @click="onExplore"
            class="focus:outline-none text-white bg-primary-light hover:bg-primary font-medium rounded-md text-sm mt-1 px-5 py-1.5"
          >
            Explore
          </button>
        </div>
      </template>
    </dsm-slide-overlay>

    <!-- Panel: Right -->
    <RightPanel v-model="panelRight" :result-data="selectResultData" />

    <DagreGraph 
      :nodes="entityRelation.nodes"
      :edges="entityRelation.edges"
      :data="entityRelation"
    />

    <!-- <sigma-graph
      :graph-data="entityRelation"
      :explore-data="exploreRelation"
      @click-node="onclickNode"
      @double-click-node="onrightClickNode"
    /> -->
  </div>
</template>

<style lang="scss" scoped></style>
