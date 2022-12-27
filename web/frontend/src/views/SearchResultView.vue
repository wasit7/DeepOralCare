<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import navigationBar from "../components/Navigation/navigation-bar.vue";
import { useRoute, useRouter } from "vue-router";
import dsmSlideOverlay from "../components/SlideOverlay/dsm-slideOverlay.vue";
import searchInput from "../components/input/search-input.vue";
import { useMainStore } from "../stores/mainStore";
import sigmaGraph from "../components/graph/sigma-relation.vue";
import inputMultiplechip from "../components/input/input-multiplechip.vue";

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

const entityFilter = computed(() => {
  return storeMain.entity_result?.filter((item) => {
    return item.name.toLowerCase().includes(searchEntity.value.toLowerCase());
  });
});

const entityRelation = computed(() => {
  return storeMain.relation_result;
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

const getDetail = (id) => {
  storeMain.getEntityDetail(id);
};

const getPredict = (queryString) => {
  storeMain.getSearch(queryString);
};

watchEffect(() => {
  if (searchQuery.value) {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
      getPredict(searchQuery.value);
    }, 500);
  }
});

const onSearch = () => {
  if (searchQuery.value === "") {
    sessionStorage.setItem("item_search", JSON.stringify(valueChip.value));
    router.push({
      name: "Search",
      params: {
        key_word: valueChip.value.map((i) => i.name).join(","),
      },
    });
  } else {
    const isExist = storeMain.search_result.find(
      (i) => i.name === searchQuery.value
    );
    addChip(isExist);
  }
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

const onclickNode = (id) => {
  storeMain.getEntityDetail(id);
};
</script>

<template>
  <navigation-bar class="fixed w-full" search-able>
    <template v-slot:search>
      <input-multiplechip
        v-model="searchQuery"
        :chipValue="valueChip"
        :resultList="storeMain.search_result"
        :loading="storeMain.loading"
        @keyup.enter="onSearch"
        @keyup.backspace="removeChip"
      />
    </template>
  </navigation-bar>
  <!-- TODO: Components relation Graph here -->
  <div class="w-full h-screen relative bg-slate-50">
    <dsm-slide-overlay
      :class="`${
        panelLeft && panelRight
          ? ' w-2/4 left-1/4'
          : panelLeft
          ? ' left-1/4 w-full'
          : panelRight
          ? ' w-3/4 '
          : 'left-0'
      }  `"
      v-model="panelBottom"
      bottom
    >
      <template v-slot:content>
        <div class="py-6 px-10">
          <p class="text-[22px]">รายละเอียดความสัมพันธ์</p>
          <div v-for="item in storeMain.sumRelation_result" :key="item">
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
            v-for="item in entityFilter"
            :key="item.id"
          >
            <li @click="getDetail(item.id)">
              <p>{{ item.name }}</p>
              <p v-for="key in Object.keys(item.attribute)" :key="key">
                {{ key }} {{ item.attribute[key] }}
              </p>
            </li>
          </ul>
        </div>
      </template>
    </dsm-slide-overlay>

    <dsm-slide-overlay v-model="panelRight" class="pt-16" right>
      <template v-slot:content>
        <div class="py-6 px-10">
          <p class="text-[22px]">รายละเอียด</p>
          <p>{{ storeMain.entityDetail.name }}</p>
          <!-- <p>คำอธิบายรายละเอียดความสัมพันธ์ของสิ่งที่เกี่ยวข้อง</p> -->
          <p>
            {{ storeMain.entityDetail.attribute }}
          </p>
        </div>
      </template>
    </dsm-slide-overlay>

    <sigma-graph :graph-data="entityRelation" @click-node="onclickNode" />
  </div>
</template>

<style lang="scss" scoped></style>
