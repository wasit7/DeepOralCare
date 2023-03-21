<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import webIcon from "./assets/imgs/CA-AppLogo.png";

const favicon = document.getElementById("favicon");
favicon.href = webIcon;
document.title = "CA";
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style lang="scss">

</style>
