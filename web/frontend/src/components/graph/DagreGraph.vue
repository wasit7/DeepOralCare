<script setup>
import G6 from "@antv/g6";
import { defineProps, defineEmits, onMounted, watch, ref, toRaw } from "vue";

const emit = defineEmits(["clickNode", "dblclickNode"]);

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
    graph.value.data(newValue);
    graph.value.render();
  }
);

onMounted(() => {
  graph.value = new G6.Graph({
    container: document.getElementById("container"),
    width: 1500,
    height: 800,
    fitView: true,
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
      nodesepFunc: () => 1,
      ranksepFunc: () => 1,
      linkDistance: () => 300,
    },
    defaultNode: {
      // size: [30, 20],
      type: "circle",
      style: {
        lineWidth: 2,
        stroke: "#5B8FF9",
        fill: "#C6E5FF",
      },
    },
    defaultEdge: {
      size: 0.5,
      color: "#e2e2e2",
      style: {
        endArrow: {
          path: "M 0,0 L 8,4 L 8,-4 Z",
          fill: "#e2e2e2",
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
    console.log("graph has been clicked ", nodeModel);
    emit("clickNode", nodeModel.id);
  });
});
</script>

<template>
  <div>
    <h1>Dagre Graph G6</h1>
    <div id="container"></div>
  </div>
</template>
