<script setup>
import { useRouter } from "vue-router";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/vue";

const router = useRouter();

const onClick = () => {
  console.log("button hamburger has clicked", process.env);
};

const props = defineProps({
  searchAble: {
    type: Boolean,
    default: false,
  },
  appName: {
    type: String,
    default: "YOUR_APP_NAME",
  },
  appLogo: {
    type: String,
    required: true,
  },
});

const routings = [
  {
    title: "หน้าแรก",
    to: {name: "ca-home"},
  },
  {
    title: "บทความ",
    to: {name: "ca-article"}
  },
  {
    title: "Knowledge Graph Explorer",
    to: {name: "Landing"}
  },
  {
    title: "ระบบวิเคราะห์ภาพ",
    to: {name: "ca-imageanalysis"},
  }
];
const goHome = () => router.push({ name: "Landing" });
const navigateRoute = (routeName) => router.push({ name: routeName})

</script>

<template>
  <Disclosure as="nav" class="bg-white shadow z-50 w-full relative" v-slot="{}">
    <div class="px-4 md:px-6 lg:px-8 w-full">
      <div
        class="flex flex-row h-12 md:h-14 lg:h-16 items-center justify-start lg:justify-around lg:px-6"
      >
        <!-- Logo -->
        <div
          class="flex justify-self-center flex-1 pr-6 items-center justify-center order-last lg:px-1 lg:order-first lg:justify-items-start lg:flex-initial"
        >
          <div @click="goHome" class="flex gap-3 flex-shrink-0 items-center">
            <img
              class="block h-6 md:h-8 w-auto"
              :src="appLogo"
              alt="Your Company"
            />
            <p
              class="block h-13 w-auto text-md md:text-lg font-bold text-[#163168]"
            >
              {{ appName }}
            </p>
          </div>
        </div>
        <!-- Menu -->
        <DisclosureButton
          data-collapse-toggle="navbar-default"
          type="button"
          class="z-50 inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-md bg-transparent lg:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </DisclosureButton>
        <DisclosurePanel
          id="navbar-default"
          class="absolute w-full top-8 md:top-11 left-0 z-30 lg:block lg:w-auto"
          :class="{ 'panel-open': open, 'panel-off': !open }"
        >
          <ul
            class="font-medium flex flex-col mt-4 md:mt-3 border border-gray-100 bg-gray-50 shadow-inner lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 lg:bg-blue-50 dark:bg-gray-800 lg:dark:bg-gray-900 dark:border-gray-700"
          >
            <li class="border-b-2" v-for="(route, index) in routings" :key="index">
              <router-link
                :to="route.to"
                class="block text-sm py-3 px-6 md:pl-11 md:pr-11 text-ellipsis rounded lg:bg-transparent lg:p-0"
                aria-current="page"
                :class="{
                  'text-primary-light font-bold': false,
                  'text-gray-400': true,
                }"
              >
                {{  route.title }}
              </router-link>
            </li>
          </ul>
        </DisclosurePanel>
        <ul
          class="z-50 font-medium hidden lg:flex flex-row space-x-8 ml-auto dark:bg-gray-900 dark:border-gray-700"
        >
          <li v-for="(route, index) in routings" :key="index">
            <!-- @click="navigateRoute(route.to.name)" -->
            <router-link
              :to="route.to"
              class="block text-sm text-ellipsis hover:text-primary-light"
              aria-current="page"
              :class="{
                'text-primary-light font-bold': false,
                'text-gray-400': true,
              }"
            >
              {{ route.title }}
            </router-link>
          </li>
        </ul>
        <div v-if="searchAble" class="xl:w-2/5 relative h-full w-1/2 py-2">
          <div class="absolute w-full">
            <slot name="search"> </slot>
          </div>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style>
  .router-link-active {
    color: #3b8f85;
    font-weight: bold;
  }
</style>