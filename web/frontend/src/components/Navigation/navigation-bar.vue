<script setup>
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import userIcon from "../Icons/userIcon.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

const props = defineProps({
  searchAble: {
    type: Boolean,
    default: false,
  },
  appName: {
    type: String,
    default: "YOUR_APP_NAME"
  },
  appLogo: {
    type: String,
    required: true
  }
});

const goHome = () =>
  router.push({
    name: "Landing",
  });
</script>

<template>
  <Disclosure as="nav" class="bg-white shadow z-50" v-slot="{}">
    <div class="mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        </div>
        <div
          :class="`flex ${
            searchAble ? '' : 'flex-1'
          } items-center justify-center sm:items-stretch sm:justify-start`"
        >
          <div
            class="flex gap-3 flex-shrink-0 items-center cursor-pointer"
            @click="goHome"
          >
            <img
              class="block  h-8 w-auto lg:hidden"
              :src="appLogo"
              alt="Your Company"
            />
            <p class="block h-13 w-auto lg:hidden text-xl font-bold  text-[#163168]">
              {{ appName }}
            </p>
            <img
              class="hidden h-8 w-auto lg:block"
              :src="appLogo"
              alt="Your Company"
            />
            <p class="hidden h-13 w-auto lg:block text-xl font-bold text-[#163168]">
              {{ appName }}
            </p>
          </div>

        </div>
        <div v-if="searchAble" class="xl:w-2/5 relative h-full w-1/2 py-2">
          <div class="absolute w-full">
            <slot name="search"> </slot>
          </div>
        </div>
        
      </div>
    </div>
  </Disclosure>
</template>
