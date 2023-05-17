// Vue router v4
import { createWebHistory, createRouter } from "vue-router";

// Create routes
const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../views/ExplorerView.vue"),
  },
  {
    path: "/landing",
    name: "ca-home",
    beforeEnter() { location.href = `${process.env.VITE_APP_ANALYSIS_APP_URL}`; }
  },
  {
    path: "/image-analysis",
    name: "ca-imageanalysis",
    beforeEnter() { location.href = `${process.env.VITE_APP_ANALYSIS_APP_URL}/image-analysis`; }
  },
  {
    path: "/article",
    name: "ca-article",
    beforeEnter() { location.href = `${process.env.VITE_APP_ANALYSIS_APP_URL}/article`; }
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// export router
export default router;
