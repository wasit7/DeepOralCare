<script setup>
import { ref, onMounted } from "vue";
import navigationBar from "../components/Navigation/navigation-bar.vue";
import { useRoute } from "vue-router";
import dsmSlideOverlay from "../components/SlideOverlay/dsm-slideOverlay.vue";
import searchInput from "../components/input/search-input.vue";

const route = useRoute();

const searchQuery = ref("");

onMounted(() => {
  console.log("mounted");
  const queryString = route.query.key_word;
  console.log(queryString);
  if (queryString) {
    searchQuery.value = queryString;
  }
});
</script>

<template>
  <navigation-bar class="fixed w-full" search-able :search-value="searchQuery" />
  <!-- TODO: Components relation Graph here -->
  <div class="w-full h-screen pt-16 relative">
    <dsm-slide-overlay class=" h-[905px]">
      <template v-slot:content>
        <div class="flex flex-col gap-3 px-10 pt-6 sticky top-0 bg-white w-full">
          <search-input :placeholder="'ค้นหารายการ'" />
          <p class="text-[22px]">รายการที่พบ</p>
        </div>
        <div class="flex flex-col gap-3  py-4   ">
          <div class=" min-h-[75px] border-b px-10 pb-4" v-for="index in 30" :key="index">
            <div>
              <p>นาง A</p>
              <p>คณะกรรมการบริษัท 123 จำกัด </p>
              <p>กรุงเทพมหานคร ประเทศไทย</p>
            </div>
          </div>
        </div>
      </template>
    </dsm-slide-overlay>
    <dsm-slide-overlay class=" h-[905px]" right>
      <template v-slot:content>
        <div class=" py-6 px-10">
          <p class="text-[22px]">รายละเอียด</p>
          <p> ชื่อสิ่งที่เกี่ยวข้อง</p>
          <p>คำอธิบายรายละเอียดความสัมพันธ์ของสิ่งที่เกี่ยวข้อง </p>
          <p>ข้อเท็จจริงหรือเรื่องราวที่เกี่ยวข้องกับสิ่งต่าง ๆ เช่น คน สัตว์ สิ่งของ สถานที่ องค์กร บุคคลฯลฯ โดยอยู่ในรูปแบบที่ เหมาะสมต่อการสื่อสาร การแปลความหมาย และการประมวลผล ซึ่งข้อมูลอาจจะได้มาจากการ
สังเกต การรวบรวม การวัดข้อมูล เป็นได้ทั้งข้อมูลตัวเลข ภาพ เสียง ข่าวสาร กิจกรรม หรือ สัญญลักษณ์ใด ๆ ที่สำคัญจะต้องมีความเป็นจริง และต่อเนื่องซึ่งตัวอย่าง ของข้อมูล </p>
        </div>
      </template>
    </dsm-slide-overlay>
  </div>
</template>

<style lang="scss" scoped>

</style>
