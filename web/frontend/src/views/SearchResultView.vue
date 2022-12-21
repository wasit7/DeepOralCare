<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import navigationBar from "../components/Navigation/navigation-bar.vue";
import { useRoute } from "vue-router";
import dsmSlideOverlay from "../components/SlideOverlay/dsm-slideOverlay.vue";
import searchInput from "../components/input/search-input.vue";
import { useMainStore } from "../stores/mainStore";
import sigmaGraph from "../components/graph/sigma-relation.vue";

const route = useRoute();
const storeMain = useMainStore();

const searchQuery = ref("");
const searchEntity = ref("");
const valueChip = ref([]);
const panelLeft = ref(true);
const panelRight = ref(true);
const panelBottom = ref(true);

const entityFilter = computed(() => {
  return storeMain.entity_result?.filter((item) => {
    return item.name.toLowerCase().includes(searchEntity.value.toLowerCase());
  });
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
</script>

<template>
  <navigation-bar
    class="fixed w-full"
    search-able
    :search-value="searchQuery"
    :chipValue="valueChip"
    :resultList="storeMain.search_result"
    :loading="storeMain.loading"
  />
  <!-- TODO: Components relation Graph here -->
  <div class="w-full h-screen relative bg-slate-50">
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
              <p>{{ item.attribute }}</p>
            </li>
          </ul>
        </div>
      </template>
    </dsm-slide-overlay>
    <dsm-slide-overlay
      :class="`${
        panelLeft && panelRight
          ? ' w-2/4 left-1/4'
          : panelLeft
          ? ' left-1/4 w-full'
          : panelRight
          ? ' w-3/4 '
          : ''
      }`"
      v-model="panelBottom"
      bottom
    >
      <template v-slot:content>
        <div class="py-6 px-10">
          <p class="text-[22px]">รายละเอียด</p>
        </div>
      </template>
    </dsm-slide-overlay>
    <dsm-slide-overlay v-model="panelRight" class="pt-16" right>
      <template v-slot:content>
        <div class="py-6 px-10">
          <p class="text-[22px]">รายละเอียด</p>
          <p>ชื่อสิ่งที่เกี่ยวข้อง</p>
          <p>คำอธิบายรายละเอียดความสัมพันธ์ของสิ่งที่เกี่ยวข้อง</p>
          <p>
            ข้อเท็จจริงหรือเรื่องราวที่เกี่ยวข้องกับสิ่งต่าง ๆ เช่น คน สัตว์
            สิ่งของ สถานที่ องค์กร บุคคลฯลฯ โดยอยู่ในรูปแบบที่
            เหมาะสมต่อการสื่อสาร การแปลความหมาย และการประมวลผล
            ซึ่งข้อมูลอาจจะได้มาจากการ สังเกต การรวบรวม การวัดข้อมูล
            เป็นได้ทั้งข้อมูลตัวเลข ภาพ เสียง ข่าวสาร กิจกรรม หรือ สัญญลักษณ์ใด
            ๆ ที่สำคัญจะต้องมีความเป็นจริง และต่อเนื่องซึ่งตัวอย่าง ของข้อมูล
          </p>
        </div>
      </template>
    </dsm-slide-overlay>

    <sigma-graph :graph-data="storeMain.relation_result" />
  </div>
</template>

<style lang="scss" scoped></style>
