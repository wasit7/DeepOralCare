import { defineStore } from "pinia";
import { axios_api } from "../api";
import NODE_LABEL_COLOR from '../utils'

const COLOR_BY_NODE_LABEL = {
  "Gene/Protein": "#61B045",
  "Drug": "#F2CF55",
  "Effect/Phenotype": "#4377BA",
  "Disease": "#EF8A2B",
  "Biological_Process": "#BB71AD",
  "Molecular_Function": "#AA7A5A",
  "Cellular_Component": "#30C1B8",
  "Exposure": "#FB8E98",
  "Pathway": "#7A7A79",
  "Anatomy": "#E05552"
};

export const useMainStore = defineStore("main", {
  state: () => ({
    // state
    res_search: [],
    loading: false,
    res_relation: {},
    res_explore: {},
    res_entityDetail: {},
    overview_data: {
      labels: {
        "ALL": { 
          name: "ALL",
          color: "#A0A0A0",
          count: 0
        },
        "Gene/Protein": {
          name: "Gene/Protein",
          color: "#61B045",
          count: 0
        },
        "Drug": {
          name: "Drug",
          color: "#F2CF55",
          count: 0
        },
        "Effect/Phenotype": {
          name: "Effect/Phenotype",
          color: "#4377BA",
          count: 0
        },
        "Disease": {
          name: "Disease",
          color: "#EF8A2B",
          count: 0
        },
        "Biological_Process": {
          name: "Biological_Process",
          color: "#BB71AD",
          count: 0
        },
        "Molecular_Function": {
          name: "Molecular_Function",
          color: "#AA7A5A",
          count: 0
        },
        "Cellular_Component": {
          name: "Cellular_Component",
          color: "#30C1B8",
          count: 0
        },
        "Exposure": {
          name: "Exposure",
          color: "#FB8E98",
          count: 0
        },
        "Pathway": {
          name: "Pathway",
          color: "#7A7A79",
          count: 0
        },
        "Anatomy": {
          name: "Anatomy",
          color: "#E05552",
          count: 0
        },
      },
      relationships: {
          color: "#A0A0A0",
          count: 0,
          names: ["*"]
      }
    }
  }),
  getters: {
    // getters
    search_result: (state) => state.res_search,
    entity_result: (state) => state.res_relation.entitys,
    sumRelation_result: (state) => state.res_relation.path_detail,
    label_overview: (state) => { console.log('M1.2:', overview_data); return state.overview_data.labels},
    relation_overview: (state) => state.overview_data.relationships,
    relation_result: (state) => {
      const { entitys, relations } = state.res_relation;

      let nodes = [];
      let edges = [];

      if (entitys && relations) {
        nodes = entitys.map((i) => {
          state.overview_data.labels["ALL"].count += 1;
          state.overview_data.labels[i.label].count += 1;
          return {
            id: i.id,
            label: i.name,
            color: COLOR_BY_NODE_LABEL[i.label],
          };
        });
        edges = relations.map((i) => {
          state.overview_data.relationships.count += 1;
          state.overview_data.relationships.names.push(i.relation)
          return {
            source: i.head,
            target: i.tail,
            relation: i.relation,
            color: "#666",
          };
        });
        state.overview_data.relationships.names = [... new Set(state.overview_data.relationships.names)];
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
            color: COLOR_BY_NODE_LABEL[i.label],
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
      
      return res.data;
    },
    async getRelation(ids) {
      const res = await axios_api.post(`/searchapp/api/entity/relation/`, {
        ids,
      });
      console.log('C1:', res.data);
      this.res_relation = res.data;
    },
    async getEntityDetail(id) {
      console.log("call");
      const res = await axios_api
        .post(`/searchapp/api/entity/getDetail/`, {
          id,
        })
        .then((res) => res);
      console.log("R1 s:", res);
      this.res_entityDetail = res.data;
      return res.data;
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
