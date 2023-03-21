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
    path: "/Search/:key_word",
    name: "Search",
    component: () => import("../views/ExplorerView.vue"),
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// export router
export default router;
