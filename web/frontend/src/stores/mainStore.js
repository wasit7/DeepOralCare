import { defineStore } from "pinia";
import { axios_api } from "../api";

const type_Color = {
  person: "#5879A3",
  company: "#E49244",
  evidence: "#A77C9F",
  transaction: "#6A9E58",
};

export const useMainStore = defineStore("main", {
  state: () => ({
    // state
    res_search: [],
    loading: false,
    res_relation: {},
    res_explore: {},
    res_entityDetail: {},
  }),
  getters: {
    // getters
    search_result: (state) => state.res_search,
    entity_result: (state) => state.res_relation.entitys,
    sumRelation_result: (state) => state.res_relation.path_detail,
    relation_result: (state) => {
      const { entitys, relations } = state.res_relation;

      let nodes = [];
      let edges = [];

      if (entitys && relations) {
        nodes = entitys.map((i) => {
          return {
            id: i.id,
            label: i.name,
            color: type_Color[i.id.split("/")[0]],
          };
        });
        edges = relations.map((i) => {
          return {
            source: i.head,
            target: i.tail,
            relation: i.relation,
            color: "#666",
          };
        });
      }

      // missing entitys check
      edges.forEach((edge) => {
        if (!nodes.find((node) => node.id === edge.source)) {
          nodes.push({
            id: edge.source,
            label: edge.source,
            color: "#666",
          });
        }
        if (!nodes.find((node) => node.id === edge.target)) {
          nodes.push({
            id: edge.target,
            label: edge.target,
            color: "#666",
          });
        }
      });

      return { nodes, edges };
      // return {
      //   nodes: entitys?.map((i) => {
      //     return {
      //       id: i.id,
      //       label: i.name,
      //       color: type_Color[i.id.split("/")[0]],
      //     };
      //   }),
      //   edges: relations?.map((i) => {
      //     return {
      //       source: i.head,
      //       target: i.tail,
      //       relation: i.relation,
      //       color: "#666",
      //     };
      //   }),
      // };
    },
    entity_detail: (state) => {
      if (!state.res_entityDetail.attribute) {
        return {};
      } else {
        const attribute_key = Object.keys(state.res_entityDetail.attribute);
        return {
          ...state.res_entityDetail,
          attribute_key,
        };
      }
    },
    explore_result: (state) => {
      const { entitys, relations } = state.res_explore;

      let nodes = [];
      let edges = [];

      if (entitys && relations) {
        nodes = entitys.map((i) => {
          return {
            id: i.id,
            label: i.name,
            color: type_Color[i.id.split("/")[0]],
          };
        });
        edges = relations.map((i) => {
          return {
            source: i.head,
            target: i.tail,
            relation: i.relation,
            color: "#666",
          };
        });
      }

      // missing entitys check
      edges.forEach((edge) => {
        if (!nodes.find((node) => node.id === edge.source)) {
          nodes.push({
            id: edge.source,
            label: edge.source,
            color: "#666",
          });
        }
        if (!nodes.find((node) => node.id === edge.target)) {
          nodes.push({
            id: edge.target,
            label: edge.target,
            color: "#666",
          });
        }
      });

      return { nodes, edges };
    },
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
    async getExplore(id) {
      const res = await axios_api.get(
        `/searchapp/api/entity/?id=${id}&page_size=100&page=0
`
      );
      this.res_explore = res.data;
    },
  },
});
