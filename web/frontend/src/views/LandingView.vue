<script setup>
import navigationBar from "../components/Navigation/navigation-bar.vue";
// import searchInput from "../components/input/search-input.vue";
import inputMultiplechip from "../components/input/input-multiplechip.vue";
import dsmBtn from "../components/button/dsm-button.vue";
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "../stores/mainStore";
import inputChip from "../components/input/input-chip.vue";

const storeMain = useMainStore();

// TODO: State of component
const router = useRouter();
const search = ref("");
const valueChip = ref([]);
const searchTimeout = ref(null);

// TODO: Methods of component
const logs = (val) => console.log("log Val :", val);

const getPredict = (queryString) => {
  storeMain.getSearch(queryString);
};

watchEffect(() => {
  if (search.value) {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
      getPredict(search.value);
    }, 500);
  }
});

const onSearch = () => {
  if (search.value === "") {
    sessionStorage.setItem("item_search", JSON.stringify(valueChip.value));
    router.push({
      name: "Search",
      params: {
        key_word: valueChip.value.map((i) => i.name).join(","),
      },
    });
  } else {
    const isExist = storeMain.search_result.find(
      (i) => i.name === search.value
    );
    addChip(isExist);
  }
};

const addChip = (item) => {
  if (item) {
    const isExist = valueChip.value.find((i) => i.id === item.id);
    if (!isExist) {
      valueChip.value.push(item);
      search.value = "";
    }
  }
};

const removeChip = () => {
  if (search.value === "" && valueChip.value.length) {
    valueChip.value.pop();
  }
};
</script>

<template>
  <navigation-bar class="fixed w-full" />
  <div
    class="sm:bg-cover bg-contain bg-no-repeat bg-bottom bg-[url('/src/assets/imgs/home-background.png')] flex gap-10 flex-col mx-auto justify-center items-center h-screen w-full"
  >
    <div class="flex flex-col items-center justify-center text-center gap-6">
      <h1 class="text-3xl">หาความเชื่อมโยงความสัมพันธ์บุคคลและนิติบุคคล</h1>
      <h2 class="text-xl">โปรดระบุชื่อบุคคล/องค์กรที่ต้องการค้นหา</h2>
    </div>
    <div class="xl:w-2/5 w-3/4">
      <input-multiplechip
        v-model="search"
        :chipValue="valueChip"
        :resultList="storeMain.search_result"
        :loading="storeMain.loading"
        @keyup.enter="onSearch"
        @keyup.backspace="removeChip"
      />
      <!-- <search-input
        v-model="search"
        :chipValue="valueChip"
        v-on:keyup.enter="addChip"
        v-on:keyup.backspace="removeChip"
      > 
        <template v-slot:append-item>
          <dsm-btn class="xl:w-48 w-28" @click="onSearch">ค้นหา</dsm-btn>
        </template>
     </search-input> -->
    </div>
    <dsm-btn class="xl:w-48 w-28" @click="onSearch">ค้นหา</dsm-btn>
  </div>
</template>

<style lang="scss" scoped></style>
