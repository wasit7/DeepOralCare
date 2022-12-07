import { defineStore } from "pinia";
import { axios_api } from "../api";

export const useMainStore = defineStore("main", {
  state: () => ({
    // state
    search_result: null,
  }),
  getters: {
    // getters
    result_value: (state) => state.search_result,
  },
  actions: {
    // actions
    async getSearch(query) {
      const res = await axios_api.get(`/searchapp/api/search/?q=${query}`);
      this.search_result = res.data;
    },
  },
});
