<script setup>
import { onMounted, ref, watchEffect } from "vue";
const chips = ref([]);
const currentInput = ref("");

const addChip = () => {
  if (currentInput.value) {
    chips.value.push(currentInput.value);
    currentInput.value = "";
  }
};

const removeChip = () => {
  if (!currentInput.value && chips.value.length) {
    chips.value.pop();
  }
};

watchEffect(() => {
  console.log("value", chips.value);
});
</script>

<template>
  <div class="chip-container">
    <div class="chip" v-for="(chip, index) in chips" :key="chip.label">
      <span>{{ chip }}</span>
      <span class="close" @click="chips.splice(index, 1)">x</span>
    </div>
    <input
      type="text"
      class="input"
      v-model="currentInput"
      @keyup.enter="addChip"
      @keyup.backspace="removeChip"
    />
  </div>
</template>

<style lang="scss" scoped>
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  .chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #ccc;
    border-radius: 0.5rem;
    .close {
      cursor: pointer;
    }
  }
  .input {
    border: none;
    outline: none;
    background-color: transparent;
  }
}
</style>
