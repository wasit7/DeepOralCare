<script setup>
import G6 from "@antv/g6";
import { defineProps, defineEmits, onMounted, watch, ref, toRaw } from "vue";

const emit = defineEmits(["clickNode", "dblclickNode", "rightclickNode"]);

const props = defineProps({
  nodes: {
    type: Array,
    // required: true,
    default: [],
  },
  edges: {
    type: Array,
    // required: true,
    default: [],
  },
  data: {
    type: Object,
  },
});

// Antv G6 Graph (Dagre)
const graph = ref();

watch(
  () => props.data,
  (newValue, oldValue) => {
    console.log(`watch props data`)
    graph.value.data(newValue);
    graph.value.render();
  }
);

onMounted(() => {
  const graphElement = document.getElementById("dagre-graph")
  const containerElement = document.getElementById("container");

  graph.value = new G6.Graph({
    container: graphElement,
    width: containerElement.scrollWidth || 1500,
    height: containerElement.scrollHeight || 1000,
    fitCenter: true,
    modes: {
      default: [
        "drag-canvas",
        "drag-node",
        // "brush-select",
        {
          type: "zoom-canvas",
        },
      ],
      // altSelect: [
      //   "drag-node",
      //   {
      //     type: "brush-select",
      //     trigger: "drag",
      //   },
      // ],
    },
    layout: {
      type: "dagre",
      rankdir: "LR",
      align: undefined, // undefined means 'start-node' and 'end-node' position are 'center' by defaults
      nodesepFunc: () => 10,
      ranksepFunc: () => 50,
      linkDistance: () => 100,
    },
    defaultNode: {
      size: [40, 40],
      type: "circle",
      style: {
        lineWidth: 1,
        stroke: "#5B8FF9",
        fill: "#C6E5FF",
      },
    },
    defaultEdge: {
      size: 1,
      color: "lightgrey",
      style: {
        lineWidth: 1,
        endArrow: {
          path: "M 0,0 L 8,4 L 8,-4 Z",
          fill: "lightgrey",
        },
      },
    },
  });
  // graph.container = document.getElementById("container");

  const data = {
    nodes: props.data.nodes,
    edges: props.data.edges,
  };
  console.log(props);
  graph.value.data(data);
  graph.value.render();

  // graph events-binding
  graph.value.on("node:click", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    emit("clickNode", nodeModel.id);
  });

  graph.value.on("node:dblclick", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    console.log("node has been double-clicked ", nodeModel);
    const newData = {
      nodes: [
        {
          original_name: "oral cavity cancer",
          name: "oral cavity cancer",
          id: "MONDO_5515_oral_cavity_cancer",
          source: "MONDO",
          label: "oral cavity cancer",
        },
        {
          original_name: "AAA",
          name: "AAA Entity",
          id: "AAA_id",
          source: "TEMP",
          label: "AAA Entity",
        },
        {
          original_name: "B",
          name: "B Entity",
          id: "B_id",
          source: "TEMP",
          label: "B Entity",
        },
      ],
      edges: [
        {
          source: "MONDO_5515_oral_cavity_cancer",
          target: "AAA_id",
          label: "AAA parent of Disease"
        },
        {
          source: "MONDO_5515_oral_cavity_cancer",
          target: "B_id",
          label: "B parent of Disease"
        }
      ]
    };

    newData.nodes.forEach( (node) => graph.value.addItem('node', node));
    newData.edges.forEach( (edge) => graph.value.addItem('edge', edge));

    // graph.value.changeData(newData, true)
    // graph.value.render();
    // emit("dblclickNode", nodeModel.id);
  });

  graph.value.on("node:contextmenu", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    console.log("node has been right-clicked (contextmenu) ", nodeModel);
  });
});
</script>

<template>
  <div id="container" class="w-full h-full p-5">
    <div id="dagre-graph"></div>
  </div>
</template>
