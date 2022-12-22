<script setup></script>

<template>
  <div class="title-container flex-row">
    <div class="spinner w-9">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle class="stroke-[#F2AD4E]" cx="50" cy="50" r="46" />
      </svg>
    </div>
    <h1 class="title text-[#F2AD4E]">กำลังโหลดข้อมูล . . .</h1>
  </div>
</template>

<style lang="scss" scoped>
.title {
  display: flex;
  font-family: Poppins;
  user-select: none;
}

.title-container {
  display: flex;
}

.spinner {
  display: flex;
  justify-content: center;
}

svg {
  width: 50%;
  max-width: 10rem;
  animation: rotate 3.6s linear infinite;
}

circle {
  fill: none;
  stroke-width: 8px;
  stroke-dasharray: 300;
  animation: outline 2s cubic-bezier(0.77, 0, 0.18, 1) infinite;
}

@keyframes outline {
  0% {
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dashoffset: 300;
  }
  100% {
    stroke-dashoffset: 600;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(-1turn);
  }
}
</style>
