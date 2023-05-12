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
import Panel from "../components/Panel/Panel.vue";
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
const searchTimeout = ref(null);
const itemsKey = ref([]);
const pageLoading = ref(false);
const selectResultID = ref(null);
const selectResultData = ref(null);

const inputIsValid  = computed(() => {
  const isValid = {
    disease: true,
    exposure: true,
    enableExploreButton: false
  }
  if (searchDisease.value.touched) {
    isValid.disease = searchDisease.value.name.length > 0 && !!searchDisease.value.id;
    // console.log(`[disease-valid]: ${isValid.disease} (${searchDisease.value.name.length > 0 && !!searchDisease.value.id})`);
  }

  if (searchExposure.value.touched) {
    isValid.exposure = searchExposure.value.name.length > 0 && !!searchExposure.value.id;
    // console.log(`[exposure-valid]: ${isValid.exposure} (${searchExposure.value.name.length > 0 && !!searchDisease.value.id})`);
  }
  // console.log(`[input-valid]: `, isValid);

  return { ...isValid, enableExploreButton: !!isValid.disease && !!isValid.exposure };
})
const searchDisease = ref({ id: null, name: "", touched: false });
const searchExposure = ref({ id: null, name: "", touched: false });
const resultDisease = ref(null);
const resultExposure = ref(null);
const slideState = ref({
  left: true,
  right: false,
  bottom: false
});
const searchLoading = reactive({
  disease: false,
  exposure: false,
  result: false,

});
const searchInputTimeout = reactive({
  disease: null,
  exposure: null,
});

const entityRelation = computed(() => {
  return storeMain.relation_result;
});

const exploreRelation = computed(() => {
  return storeMain.explore_result;
});

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
  selectResultID.value = id;
  selectResultData.value = await storeMain.getEntityDetail(id);
  slideState.value.right = true;
  slideState.value.bottom = true;
};

const onrightClickNode = async (id) => {
  pageLoading.value = true;
  await storeMain.getExplore(id);
  setTimeout(() => {
    pageLoading.value = false;
    slideState.value.right = false;
    slideState.value.bottom = false;
  }, 240);
};


const onExplore = async () => {
  searchLoading.result = true;
  const { id: diseaseId } = searchDisease.value;
  const { id: exposureId } = searchExposure.value;
  const ids = [diseaseId, exposureId].filter( (elem) => !!elem);
  // console.log(`searching relationship between ${diseaseId} and ${exposureId} (${ids.length})`);
  await storeMain.getRelation(ids);
  searchLoading.result = false;

  const navbarElement = document.getElementById("navbar");
  console.log(navbarElement.clientWidth);
  if (navbarElement.clientWidth < 800) {
    slideState.value.left = false;
    slideState.value.right = false;
  }

};

const onSelection = (entity, entitySelected) => {
  entity.id = entitySelected.id;
  entity.name = entitySelected.name;
  entity.touched = false;
  // console.log(entity);
};

const onSearchDiseaseEntity = async (searchObj) => {
  await storeMain.getSearchDisease(searchObj.name);
  const results = storeMain.search_result;
  return results;
};

const onSearchExposureEntity = async (searchObj) => {
  await storeMain.getSearchExposure(searchObj.name);
  const results = storeMain.search_result;
  return results;
};

watch(searchDisease.value, (newValue) => {
  // console.log(searchDisease.value);
  clearTimeout(searchInputTimeout.disease);
  searchLoading.disease = true;
  if (searchDisease.value.name.length === 0) {
    searchDisease.value.id = null;
    searchDisease.value.touched = false;
  }
  
  if (searchDisease.value.name.length > 0) {
    // console.log("search entity .... ");
    searchInputTimeout.disease = setTimeout(async () => {
      resultDisease.value = await onSearchDiseaseEntity(searchDisease.value);
      searchDisease.value.touched = true;
    
    }, 700);
  }
  searchLoading.disease = false;
});

watch(searchExposure.value, (newValue) => { 
  clearTimeout(searchInputTimeout.exposure);
  searchLoading.exposure = true;
  if (searchExposure.value.name.length === 0) {
    searchExposure.value.id = null;
    searchExposure.value.touched = false;
  }
  
  if (searchExposure.value.name.length > 0) {
    searchInputTimeout.exposure = setTimeout(async () => {
      resultExposure.value = await onSearchExposureEntity(searchExposure.value);
      searchExposure.value.touched = true;
    }, 700);
  }
  searchLoading.exposure = false;
});
</script>

<template>
  <!-- Navigation -->
  <navigation-bar
    id="navbar"
    class="fixed w-full"
    app-name="Knowledge Graph Explorer"
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
    <dsm-slide-overlay left v-model="slideState.left" >
      <template class="h-3/5" v-slot:content>
        <div class="z-30 flex flex-col gap-3 px-5 pt-16 sticky top-0 bg-white w-full">
          <SearchBox
            v-model="searchDisease"
            label="Disease"
            placeholder="touge cancer"
            text-invalid="please, select entity from dropdown list only"
            :input-invalid="!inputIsValid.disease"
            :is-loading="searchLoading.disease"
            :dropdowns="resultDisease"
            @on-search="searchDisease.name = $event"
            @on-select-result="onSelection(searchDisease, $event)"
          />
          <SearchBox
            v-model="searchExposure"
            label="Exposure"
            placeholder="tobacco tar"
            text-invalid="please, select entity from dropdown list only"
            :input-invalid="!inputIsValid.exposure"
            :is-loading="searchLoading.exposure"
            @on-search="searchExposure.name = $event"
            @on-select-result="onSelection(searchExposure, $event)"
            :dropdowns="resultExposure"
          />

          <!-- :disabled="!((searchExposure.id || searchDisease.id) && inputIsValid.enableExploreButton)" -->
          <button
            id="btn-explore"
            type="button"
            @click="onExplore"
            class="focus:outline-none text-white bg-primary-light hover:bg-primary font-medium rounded-md text-sm mt-1 px-5 py-1.5"
            :class="{
              'opacity-75 cursor-wait': searchLoading.result,
              'opacity-50 cursor-not-allowed': !((searchExposure.id || searchDisease.id) && inputIsValid.enableExploreButton)
            }"
          >
            <span v-if="!searchLoading.result">Explore</span>
            <span
              v-else
              id="span-explore"
              class="flex flex-row justify-center align-baseline"
            >
              <svg
                aria-hidden="true"
                role="status"
                class="inline w-4 h-4 mr-1 text-white animate-spin self-end"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#f28606"
                />
              </svg>
              Loading...
            </span>
          </button>
        </div>
      </template>
    </dsm-slide-overlay>

    <!-- Panel: Right -->
    <Panel 
      v-model="slideState.right"
      :right-panel="true"
      :result-data="selectResultData" 
    />

    <!-- Panel: Bottom -->
    <Panel 
      v-model="slideState.bottom" 
      :bottom-panel="true"
      :result-data="selectResultData" 
    />

    <DagreGraph 
      :data="entityRelation"
      :node-explore="exploreRelation"
      @click-node="onclickNode"
      @dblclick-node="onrightClickNode"
    />
  </div>
</template>

<style lang="scss" scoped></style>
