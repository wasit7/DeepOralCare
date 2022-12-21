import { defineStore } from "pinia";
import { axios_api } from "../api";

export const useMainStore = defineStore("main", {
  state: () => ({
    // state
    res_search: [],
    loading: false,
    res_relation: {},
    res_entityDetail: {},
  }),
  getters: {
    // getters
    search_result: (state) => state.res_search,
    entity_result: (state) => state.res_relation.entitys,
    relation_result: (state) => {
      const { entitys, relations } = state.res_relation;

      return {
        nodes: entitys?.map((i) => {
          return {
            id: i.id,
            label: i.name,
            color: "#666",
          };
        }),
        edges: relations?.map((i) => {
          return {
            source: i.head,
            target: i.tail,
            relation: i.relation,
            color: "#666",
          };
        }),
      };
    },
    entityDetail: (state) => state.res_entityDetail,
  },
  actions: {
    // actions
    async getSearch(query) {
      this.loading = true;
      this.res_search = [];
      const res = await axios_api.get(`/searchapp/api/search/?q=${query}`);
      this.res_search = res.data;
      if (res.data) {
        this.loading = false;
      }
    },
    async getRelation(ids) {
      const res = await axios_api.post(`/searchapp/api/entity/relation/`, {
        ids,
      });
      this.res_relation = res.data;
    },
    async getEntityDetail(id) {
      const res = await axios_api.post(`/searchapp/api/entity/getDetail/`, {
        id,
      });
      this.res_entityDetail = res.data;
    },
  },
});
