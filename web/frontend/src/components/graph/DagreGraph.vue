<script setup>
import G6 from "@antv/g6";
import { defineProps, defineEmits, onMounted, watch, ref, toRaw } from "vue";

const emit = defineEmits(["clickNode", "dblclickNode", "rightclickNode"]);

const props = defineProps({
  nodeExplore: {
    type: Object,
    default: {}
  },
  data: {
    type: Object,
  },
});

const graph = ref(null);

onMounted(() => {
  // initialize graph
  const graphElement = document.getElementById("dagre-graph");
  const containerElement = document.getElementById("container");

  graph.value = new G6.Graph({
    container: graphElement,
    width: containerElement.scrollWidth || 1500,
    height: containerElement.scrollHeight || 1000,
    fitCenter: true,
    animate: true,
    animateCfg: {
      duration: 1200
    },
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
      nodesepFunc: () => 5,
      ranksepFunc: () => 40,
      linkDistance: () => 50,
    },
    defaultNode: {
      size: [40, 40],
      type: "circle",
      labelCfg: {
        position: "top"
      },
      style: {
        lineWidth: 1,
        stroke: "#5B8FF9",
        fill: "#C6E5FF",
      },
    },
    defaultEdge: {
      size: 1,
      color: "lightgrey",
      labelCfg: {
        // position: "middle",
        refY: 15,
      },
      style: {
        opacity: 1,
        lineWidth: 1,
        endArrow: {
          path: "M 0,0 L 8,4 L 8,-4 Z",
          fill: "lightgrey",
        },
      },
    },
  });

  // data from props.data in the first-time maybe empty
  const data = {
    nodes: props.data.nodes,
    edges: props.data.edges,
  };
  // data data, then render graph
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
    emit("dblclickNode", nodeModel.id);
  });

  graph.value.on("node:contextmenu", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    console.log("node has been right-clicked (contextmenu) ", nodeModel);
  });
});



watch(
  () => props.data,
  (newValue, oldValue) => {
    // after search
    graph.value.data(newValue);
    graph.value.render();
  }
);

watch(
  () => props.nodeExplore,
  (newValue, oldValue) => {
    // after double-click on node
    newValue.nodes.forEach( (node) => graph.value.addItem('node', node));
    newValue.edges.forEach( (edge) => graph.value.addItem('edge', edge));
    graph.value.layout();
  }
);
</script>

<template>
  <div id="container" class="w-full h-full p-5">
    <div id="dagre-graph"></div>
  </div>
</template>
