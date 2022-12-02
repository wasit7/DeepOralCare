// Vue router v4
import { createWebHistory, createRouter } from "vue-router";

// Create routes
const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/LandingView.vue"),
  },
  {
    path: "/Search",
    name: "Search",
    component: () => import("../views/SearchResultView.vue"),
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// export router
export default router;
