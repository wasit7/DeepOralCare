import { defineStore } from "pinia";
import { axios_api } from "../api";

export const useMainStore = defineStore("main", {
  state: () => ({
    // state
    res_search: [],
    loading: false,
    res_relation: [],
  }),
  getters: {
    // getters
    search_result: (state) => state.res_search,
    relation_result: (state) => state.res_relation,
  },
  actions: {
    // actions
    async getSearch(query) {
      this.loading = true;
      const res = await axios_api.get(`/searchapp/api/search/?q=${query}`);
      this.res_search = res.data;
      if (res.data) {
        this.loading = false;
      }
    },
    async getRelation(ids) {
      const res = await axios_api.post("/searchapp/api/entity/relation/", {
        ids,
      });
      this.res_relation = res.data;
    },
  },
});
