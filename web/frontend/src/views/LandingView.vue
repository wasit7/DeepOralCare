<script setup>
import navigationBar from "../components/Navigation/navigation-bar.vue";
import searchInput from "../components/input/search-input.vue";
import dsmBtn from "../components/button/dsm-button.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

// TODO: State of component
const router = useRouter();
const search = ref("");

// TODO: Methods of component
const logs = (val) => console.log("log Val :", val);

const onSearch = () => {
  router.push({
    name: "Search",
    query: {
      key_word: search.value,
    },
  });
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
      <search-input
        v-model="search"
        append-item
        v-on:keyup.enter="onSearch"
        :placeholder="'ex. relation: PersonA,PersonB'"
      >
        <template v-slot:append-item>
          <dsm-btn class="xl:w-48 w-28" @click="onSearch">ค้นหา</dsm-btn>
        </template>
      </search-input>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
